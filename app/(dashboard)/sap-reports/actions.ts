'use server';
import connection from '@/services/database';
import type { SapReportRecord } from '@/utils/types/sapReports';

export interface SapReportsFilters {
  rfqSys?: string;
  poStatus?: string;
  lineStatus?: string;
  orderNumber?: string;
  vendorName?: string;
  project?: string;
  itemCode?: string;
  itemDescription?: string;
  orderDate?: Date;
  promisedDeliveryDate?: Date;
  receivedDate?: Date;
  invoiceDate?: Date;
  global?: string;
}

export interface SapReportsResponse {
  data: SapReportRecord[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

export async function getSapReports(
  page: number = 0,
  pageSize: number = 100,
  filters: SapReportsFilters = {}
): Promise<SapReportsResponse> {
  try {
    await connection.connect();
    
    // Construir la consulta WHERE basada en los filtros
    const whereConditions: string[] = [];
    const request = connection.request();
    
    // Filtro global
    if (filters.global && filters.global.trim() !== '') {
      const globalFilter = `%${filters.global.trim()}%`;
      whereConditions.push(`(
        rfqSys LIKE @global OR 
        poStatus LIKE @global OR 
        lineStatus LIKE @global OR 
        orderNumber LIKE @global OR 
        vendorName LIKE @global OR 
        project LIKE @global OR 
        itemCode LIKE @global OR 
        itemDescription LIKE @global OR
        manufacturerNumber LIKE @global
      )`);
      request.input('global', globalFilter);
    }
    
    // Filtros específicos por campo
    if (filters.rfqSys && filters.rfqSys.trim() !== '') {
      whereConditions.push('rfqSys LIKE @rfqSys');
      request.input('rfqSys', `%${filters.rfqSys.trim()}%`);
    }
    
    if (filters.poStatus && filters.poStatus.trim() !== '') {
      whereConditions.push('poStatus LIKE @poStatus');
      request.input('poStatus', `%${filters.poStatus.trim()}%`);
    }
    
    if (filters.lineStatus && filters.lineStatus.trim() !== '') {
      whereConditions.push('lineStatus LIKE @lineStatus');
      request.input('lineStatus', `%${filters.lineStatus.trim()}%`);
    }
    
    if (filters.orderNumber && filters.orderNumber.trim() !== '') {
      whereConditions.push('orderNumber LIKE @orderNumber');
      request.input('orderNumber', `%${filters.orderNumber.trim()}%`);
    }
    
    if (filters.vendorName && filters.vendorName.trim() !== '') {
      whereConditions.push('vendorName LIKE @vendorName');
      request.input('vendorName', `%${filters.vendorName.trim()}%`);
    }
    
    if (filters.project && filters.project.trim() !== '') {
      whereConditions.push('project LIKE @project');
      request.input('project', `%${filters.project.trim()}%`);
    }
    
    if (filters.itemCode && filters.itemCode.trim() !== '') {
      whereConditions.push('itemCode LIKE @itemCode');
      request.input('itemCode', `%${filters.itemCode.trim()}%`);
    }
    
    if (filters.itemDescription && filters.itemDescription.trim() !== '') {
      whereConditions.push('itemDescription LIKE @itemDescription');
      request.input('itemDescription', `%${filters.itemDescription.trim()}%`);
    }
    
    // Filtros de fecha
    if (filters.orderDate) {
      whereConditions.push('CAST(orderDate AS DATE) = CAST(@orderDate AS DATE)');
      request.input('orderDate', filters.orderDate);
    }
    
    if (filters.promisedDeliveryDate) {
      whereConditions.push('CAST(promisedDeliveryDate AS DATE) = CAST(@promisedDeliveryDate AS DATE)');
      request.input('promisedDeliveryDate', filters.promisedDeliveryDate);
    }
    
    if (filters.receivedDate) {
      whereConditions.push('CAST(receivedDate AS DATE) = CAST(@receivedDate AS DATE)');
      request.input('receivedDate', filters.receivedDate);
    }
    
    if (filters.invoiceDate) {
      whereConditions.push('CAST(invoiceDate AS DATE) = CAST(@invoiceDate AS DATE)');
      request.input('invoiceDate', filters.invoiceDate);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) as total FROM FileDataCache ${whereClause}`;
    const countResult = await request.query(countQuery);
    const totalRecords = countResult.recordset[0].total;
    
    // Consulta para obtener los datos paginados
    const offset = page * pageSize;
    request.input('offset', offset);
    request.input('pageSize', pageSize);
    
    const dataQuery = `
      SELECT * FROM FileDataCache 
      ${whereClause}
      ORDER BY id
      OFFSET @offset ROWS 
      FETCH NEXT @pageSize ROWS ONLY
    `;
    
    const dataResult = await request.query(dataQuery);
    
    return {
      data: dataResult.recordset as SapReportRecord[],
      totalRecords,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching SAP reports:', error);
    throw error;
  }
}