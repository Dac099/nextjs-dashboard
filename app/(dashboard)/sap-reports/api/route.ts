import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import connection from '@/services/database';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionPool } from 'mssql';


export async function POST(request: NextRequest) {
  let tempFilePath = '';
  
  try {
    const formData = await request.formData();
    const file = formData.get('report[]') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' }, 
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos .txt' }, 
        { status: 400 }
      );
    }

    // Crear directorio temporal si no existe
    const tempDir = path.join(process.cwd(), 'temp');
    await mkdir(tempDir, { recursive: true });

    // Guardar el archivo temporalmente para poder usar streams
    tempFilePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    const fileBuffer = await file.arrayBuffer();
    await writeFile(tempFilePath, Buffer.from(fileBuffer));
    
    // Generar un ID de lote para esta carga
    const batchId = uuidv4();
    
    // Obtener conexión a la base de datos
    const pool = await connection.connect();
    
    // Eliminar registros anteriores
    await pool.request().query('DELETE FROM dbo.FileDataCache');
    
    // Crear stream de lectura del archivo con codificación UTF-16LE para manejar acentos y ñ
    const fileStream = createReadStream(tempFilePath, { encoding: 'utf16le' });
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    // Variables para el proceso de líneas
    let isFirstLine = true;  // Para omitir la línea de encabezados
    let lineCount = 0;
    let processedCount = 0;
    let errorCount = 0;
    let batchRows = [];
    const batchSize = 500;
    
    // Procesar el archivo línea por línea
    for await (const line of rl) {
      // Omitir la primera línea (encabezados)
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }
      
      // Omitir líneas vacías
      if (!line.trim()) continue;
      
      try {
        // Incrementar contador de líneas
        lineCount++;
        
        // Procesar la línea actual y dividirla en columnas
        const columns = line.split('\t');
        
        // Si la línea no tiene suficientes columnas, omitir
        if (columns.length < 37) {
          errorCount++;
          continue;
        }
        
        columns.shift();
        
        // Añadir a la lista de batch con tratamiento seguro para valores
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
          orderedQuantity: parseDecimal(columns[13], 2),
          totalOrderAmountFC: parseDecimal(columns[14], 2),
          totalOrderAmount: parseDecimal(columns[15], 2),
          promisedDeliveryDate: parseDateDMY(columns[16]),
          receivedDate: parseDateDMY(columns[17]),
          receiptNumbers: cleanString(columns[18]),
          receivedQuantity: parseDecimal(columns[19], 2),
          totalReceivedAmount: parseDecimal(columns[20], 2),
          totalReceivedAmountFC: parseDecimal(columns[21], 2),
          invoiceDate: parseDateDMY(columns[22]),
          invoiceNumbers: cleanString(columns[23]),
          invoicedQuantity: parseDecimal(columns[24], 2),
          totalInvoicedAmount: parseDecimal(columns[25], 2),
          totalInvoicedAmountFC: parseDecimal(columns[26], 2),
          pendingInvoiceQuantity: parseDecimal(columns[27], 2),
          pendingInvoiceAmount: parseDecimal(columns[28], 2),
          pendingInvoiceAmountFC: parseDecimal(columns[29], 2),
          pendingReceiptQuantity: parseDecimal(columns[30], 2),
          pendingReceiptAmount: parseDecimal(columns[31], 2),
          pendingReceiptAmountFC: parseDecimal(columns[32], 2),
          receivedPercentAmount: parseDecimal(columns[33], 2),
          invoicedPercentAmount: parseDecimal(columns[34], 2),
          receivedPercentQuantity: parseDecimal(columns[35], 2),
          invoicedPercentQuantity: parseDecimal(columns[36], 2),
          batchId: batchId
        });
        
        // Si alcanzamos el tamaño del lote, insertamos en la base de datos
        if (batchRows.length >= batchSize) {
          try {
            await insertBatch(pool, batchRows);
            processedCount += batchRows.length;
          } catch {
            errorCount += batchRows.length;
          }
          
          batchRows = []; // Limpiar el lote actual
        }
      } catch {
        errorCount++;
      }
    }
    
    // Insertar el último lote si quedaron registros
    if (batchRows.length > 0) {
      try {
        await insertBatch(pool, batchRows);
        processedCount += batchRows.length;
      } catch {
        errorCount += batchRows.length;
      }
    }
    
    // Obtener recuento final de registros
    const countResult = await pool.request().query('SELECT COUNT(*) as total FROM dbo.FileDataCache');
    const totalRecords = countResult.recordset[0].total;
    
    // Eliminar el archivo temporal
    await unlink(tempFilePath);
    
    return NextResponse.json({ 
      success: true,
      message: `Archivo procesado exitosamente.`,
      stats: {
        totalLines: lineCount,
        processed: processedCount,
        errors: errorCount,
        totalInDatabase: totalRecords
      },
      filename: file.name,
      size: file.size,
      batchId: batchId,
    });

  } catch (error) {
    // Intentar eliminar el archivo temporal si existe
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch {
        // Ignorar errores al eliminar archivo temporal
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
 * Limpia y valida una cadena de texto (preservando acentos y ñ)
 * @param value Valor a limpiar
 * @returns Cadena limpia o null si está vacía
 */
function cleanString(value: string): string | null {
  if (!value || value.trim() === '') return null;
  return value.trim();
}

/**
 * Parsea un valor a decimal con manejo seguro de errores
 * @param value Valor a parsear
 * @param decimals Número de decimales (por defecto 2)
 * @returns Valor decimal o 0 si no es válido
 */
function parseDecimal(value: string, decimals: number = 2): number {
  if (!value || value.trim() === '') return 0;
  
  try {
    // Eliminar caracteres no numéricos excepto puntos y comas
    const cleanValue = value.replace(/[^\d.,\-]/g, '');
    
    // Reemplazar comas por puntos para asegurar formato correcto
    const normalizedValue = cleanValue.replace(/,/g, '.');
    
    // Intentar convertir a número
    const num = parseFloat(normalizedValue);
    
    // Validar resultado
    if (isNaN(num)) return 0;
    
    // Redondear al número de decimales especificado
    return parseFloat(num.toFixed(decimals));
  } catch {
    return 0;
  }
}

/**
 * Parsea una fecha en formato DD/MM/YYYY (formato español)
 * @param dateStr Cadena de fecha a parsear
 * @returns Objeto Date o null si no es válida
 */
function parseDateDMY(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  try {
    // Limpiar la cadena de fecha
    const cleanDateStr = dateStr.trim();
    
    // Formato específico DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDateStr)) {
      const [day, month, year] = cleanDateStr.split('/').map(Number);
      
      // Crear fecha - el mes se resta 1 porque en JavaScript los meses van de 0 a 11
      const date = new Date(year, month - 1, day);
      
      // Validar que la fecha sea válida
      if (!isNaN(date.getTime()) && 
          date.getDate() === day && 
          date.getMonth() === month - 1 && 
          date.getFullYear() === year) {
        return date;
      }
    }
    
    // Intentar otros formatos como fallback
    const date = new Date(cleanDateStr);
    if (!isNaN(date.getTime())) return date;
    
    return null;
  } catch{
    return null;
  }
}

/**
 * Inserta un lote de registros en la base de datos
 * @param pool Pool de conexión a la base de datos
 * @param rows Filas a insertar
 */
async function insertBatch(pool: ConnectionPool, rows: any[]) {
  // Ejecutar inserciones dentro de una transacción para este lote
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