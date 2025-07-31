import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import connection from '@/services/database';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionPool } from 'mssql';
import type { SapReportRecord } from '@/utils/types/sapReports';

export async function POST(request: NextRequest) {
  let tempFilePath = '';
  
  try {
    // The first step is to get the file from the request by the name
    const formData = await request.formData();
    const file = formData.get('report[]') as File;
    
    // Validate if the file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' }, 
        { status: 400 }
      );
    }

    // Only accept .txt files
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos .txt' }, 
        { status: 400 }
      );
    }

    // We store the file in a temporary directory to stream it later
    const tempDir = path.join(process.cwd(), 'temp');
    await mkdir(tempDir, { recursive: true });

    tempFilePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    const fileBuffer = await file.arrayBuffer();
    await writeFile(tempFilePath, Buffer.from(fileBuffer));
    
    // In the DB we use a UUID to track the batch of records
    const batchId = uuidv4();  
    const pool = await connection.connect();
    
    /**
      * Every time the file is uploaded, we eliminate the previous records
      * Since the file contains complete records and thus avoid duplicates
      * And you don't have to update existing records.
     */
    await pool.request().query('TRUNCATE TABLE dbo.FileDataCache');

    // The encoding of the file is UTF-16LE, so we need to read it accordingly
    const fileStream = createReadStream(tempFilePath, { encoding: 'utf16le' });
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let isFirstLine = true;  // Omit the first line that contains headers
    let batchRows = [];
    const batchSize = 500; //Use a batch size of 500 for inserts
    
    for await (const line of rl) {
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }
      
      // If the line is empty, we dont process it
      if (!line.trim()) continue;
      
      try {
        const columns = line.split('\t');
        // The first column is the index of the item, we can ignore it, since we have an identity column in the DB
        columns.shift();

        // Add the object to the batch list
        batchRows.push({
          rfqSys: cleanString(columns[0]),
          poStatus: cleanString(columns[1]),
          lineStatus: cleanString(columns[2]),
          orderDate: parseDateDMY(columns[3]),
          orderNumber: cleanString(columns[4]),
          vendorCode: cleanString(columns[5]),
          vendorName: cleanString(columns[6]),
          project: cleanString(columns[7]),
          itemCode: cleanString(columns[8]),
          manufacturerNumber: cleanString(columns[9]),
          itemDescription: cleanString(columns[10]),
          priceCurrency: cleanString(columns[11]),
          unitPrice: parseDecimal(columns[12], 4),
          orderedQuantity: parseDecimal(columns[13], 4),
          totalOrderAmountFC: parseDecimal(columns[14], 4),
          totalOrderAmount: parseDecimal(columns[15], 4),
          promisedDeliveryDate: parseDateDMY(columns[16]),
          receivedDate: parseDateDMY(columns[17]),
          receiptNumbers: cleanString(columns[18]),
          receivedQuantity: parseDecimal(columns[19], 4),
          totalReceivedAmount: parseDecimal(columns[20], 4),
          totalReceivedAmountFC: parseDecimal(columns[21], 4),
          invoiceDate: parseDateDMY(columns[22]),
          invoiceNumbers: cleanString(columns[23]),
          invoicedQuantity: parseDecimal(columns[24], 4),
          totalInvoicedAmount: parseDecimal(columns[25], 4),
          totalInvoicedAmountFC: parseDecimal(columns[26], 4),
          pendingInvoiceQuantity: parseDecimal(columns[27], 4),
          pendingInvoiceAmount: parseDecimal(columns[28], 4),
          pendingInvoiceAmountFC: parseDecimal(columns[29], 4),
          pendingReceiptQuantity: parseDecimal(columns[30], 4),
          pendingReceiptAmount: parseDecimal(columns[31], 4),
          pendingReceiptAmountFC: parseDecimal(columns[32], 4),
          receivedPercentAmount: parseDecimal(columns[33], 4),
          invoicedPercentAmount: parseDecimal(columns[34], 4),
          receivedPercentQuantity: parseDecimal(columns[35], 4),
          invoicedPercentQuantity: parseDecimal(columns[36], 4),
          batchId: batchId
        });
        
        // Once complete the batch, we insert it into the database
        if (batchRows.length >= batchSize) {
          try {
            await insertBatch(pool, batchRows);
          } catch (error) {
            throw error;
          }
          
          // Reset the batch array
          batchRows = [];
        }
      } catch(error) {
        throw error;
      }
    }
    
    // Insert any remaining rows in the last batch
    if (batchRows.length > 0) {
      try {
        await insertBatch(pool, batchRows);
      } catch (error) {
        throw error;
      }
    }
    
    // Delete the temporary file after processing
    await unlink(tempFilePath);

    console.log(`Successfully processed file`);
    return NextResponse.json({ 
      success: true,
      message: `Successfully file processed and loaded`,
      filename: file.name,
      size: file.size,
      batchId: batchId,
    });

  } catch (error) {

    // If there is an error, we delete the temporary file if it exists
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        throw error;
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error al procesar el archivo', 
        details: String(error),
        suggestion: 'Verifique el formato del archivo e intente nuevamente.'
      }, 
      { status: 500 }
    );
  }
}

/**
 * Clean and validate a text chain (preserving accents and ñ)
 * @param value Value to clean
 * @returns Cleaned string or null if empty
 */
function cleanString(value: string): string | null {
  if (!value || value.trim() === '') return null;
  return value.trim();
}

/**
 * Parse a decimal value with safe errors management
 * @param value Value to parse
 * @param decimals Number of decimals (default 2)
 * @returns Decimal value or 0 if invalid
 */
function parseDecimal(value: string, decimals: number = 2): number {
  if (!value || value.trim() === '') return 0;
  
  try {
    // Delete any character that is not a digit, comma, dot or minus sign
    const cleanValue = value.replace(/[^\d.,\-]/g, '');
        
    // Replace commas by points to ensure correct format
    const normalizedValue = cleanValue.replace(/,/g, '.');
    
    // Try to parse the value as a float
    const num = parseFloat(normalizedValue);
    
    if (isNaN(num)) return 0;
    
    // Fix the number to the specified number of decimals 
    const multiplier = Math.pow(10, decimals);
    
    //Truncate to avoid floating point issues
    return Math.trunc(num * multiplier) / multiplier;
  } catch {
    return 0;
  }
}

/**
 * Parea a date in DD/mm/yyyy format (Spanish format)
 * @param dateStr String to parse
 * @returns Date object or null if invalid
 */
function parseDateDMY(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  try {
    // Remove extra spaces
    const cleanDateStr = dateStr.trim();
    
    // Validate the format DD/mm/yyyy
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDateStr)) {
      const [day, month, year] = cleanDateStr.split('/').map(Number);
      
      // Create the date object
      const date = new Date(year, month - 1, day);
      
      // Validate that the date is valid
      if (!isNaN(date.getTime()) && 
          date.getDate() === day && 
          date.getMonth() === month - 1 && 
          date.getFullYear() === year) {
        return date;
      }
    }    
    return null;
  } catch (error){
    throw error;
  }
}

/**
 * Insert a lot of records into the database
 * @param pool Database connection pool
 * @param rows Rows to insert
 */
async function insertBatch(pool: ConnectionPool, rows: SapReportRecord[]) {
  // Execute insertions within a transaction for this batch
  const transaction = pool.transaction();
  
  try {
    await transaction.begin();
    
    for (const row of rows) {
      const request = transaction.request();
      
      // Configurar parámetros para la inserción
      Object.entries(row).forEach(([key, value]) => {
        request.input(key, value);
      });
      
      // Ejecutar la consulta de inserción
      await request.query(`
        INSERT INTO dbo.FileDataCache (
          rfqSys, poStatus, lineStatus, orderDate, orderNumber, vendorCode, 
          vendorName, project, itemCode, manufacturerNumber, itemDescription, 
          priceCurrency, unitPrice, orderedQuantity, totalOrderAmountFC, 
          totalOrderAmount, promisedDeliveryDate, receivedDate, receiptNumbers, 
          receivedQuantity, totalReceivedAmount, totalReceivedAmountFC, 
          invoiceDate, invoiceNumbers, invoicedQuantity, totalInvoicedAmount, 
          totalInvoicedAmountFC, pendingInvoiceQuantity, pendingInvoiceAmount, 
          pendingInvoiceAmountFC, pendingReceiptQuantity, pendingReceiptAmount, 
          pendingReceiptAmountFC, receivedPercentAmount, invoicedPercentAmount, 
          receivedPercentQuantity, invoicedPercentQuantity, batchId
        ) 
        VALUES (
          @rfqSys, @poStatus, @lineStatus, @orderDate, @orderNumber, @vendorCode, 
          @vendorName, @project, @itemCode, @manufacturerNumber, @itemDescription, 
          @priceCurrency, @unitPrice, @orderedQuantity, @totalOrderAmountFC, 
          @totalOrderAmount, @promisedDeliveryDate, @receivedDate, @receiptNumbers, 
          @receivedQuantity, @totalReceivedAmount, @totalReceivedAmountFC, 
          @invoiceDate, @invoiceNumbers, @invoicedQuantity, @totalInvoicedAmount, 
          @totalInvoicedAmountFC, @pendingInvoiceQuantity, @pendingInvoiceAmount, 
          @pendingInvoiceAmountFC, @pendingReceiptQuantity, @pendingReceiptAmount, 
          @pendingReceiptAmountFC, @receivedPercentAmount, @invoicedPercentAmount, 
          @receivedPercentQuantity, @invoicedPercentQuantity, @batchId
        )
      `);
    }
    
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}