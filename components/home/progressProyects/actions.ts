'use server';
import connection from '@/services/database';
import { formatFileData, formatStringToDate } from '@/utils/helpers';
import { getFileData } from '@/app/(dashboard)/sap-reports/actions';
import type { ItemRequisition, SapRecord, ItemReport, RFQsData, AdvancedFilter } from '@/utils/types/requisitionsTracking';

async function getDataFromSapReport(): Promise<SapRecord[]> {
  try {
    const [fileData] = await getFileData();
    const formatedFileData = formatFileData(fileData);
    const headerValues = formatedFileData[0];
    const values = formatedFileData.slice(1).map((row) => {
      return Object.fromEntries(row.map((value, i) => [headerValues[i], value]));
    });

    return values as SapRecord[];
  } catch (error) {
    throw error;
  }
}

async function getItemsFromRequisition(
  offset: number, 
  limit: number,
  globalFilter: string | null = null,
  advancedFilter: AdvancedFilter | null = null
): Promise<ItemRequisition[]> {
  console.log(advancedFilter)
  try {
    await connection.connect();
    globalFilter = globalFilter?.toLowerCase() || null;
    let whereClause = '';

    if(globalFilter && !advancedFilter){
      whereClause = `
        WHERE LOWER(trd.no_parte) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.desc_articulo) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.id_proyecto) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.tipo_maquinado) LIKE '%' + @globalFilter + '%'
          OR LOWER(tr.num_req) LIKE '%' + @globalFilter + '%'
          OR LOWER(tu.nom_user) LIKE '%' + @globalFilter + '%'
      `;
    }

    if(advancedFilter) {
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'between'){
        const [startDate, endDate] = advancedFilter.userInput as Date[];
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) BETWEEN '${startDate.toISOString().slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'equals'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) = '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'greater'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) > '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'less'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) < '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'rfq_state'){
        const rfqState = advancedFilter.userInput as string;
        whereClause = `
          WHERE me.Desc_Estatus = '${rfqState}'
        `;
      }
      if(advancedFilter.column === 'rfq_type'){
        const rfqType = advancedFilter.userInput as string;
        whereClause = `
          WHERE tr.id_tiporeq = '${rfqType}'
        `;
      }

      if(globalFilter) {
        whereClause += `
          AND (LOWER(trd.no_parte) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.desc_articulo) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.id_proyecto) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.tipo_maquinado) LIKE '%' + @globalFilter + '%'
            OR LOWER(tr.num_req) LIKE '%' + @globalFilter + '%'
            OR LOWER(tu.nom_user) LIKE '%' + @globalFilter + '%')
        `;
      }
    }

    const resultQuery = await connection
    .request()
    .input('limit', limit)
    .input('offset', offset)
    .input('globalFilter', globalFilter)
    .query(`
      SELECT
        trd.no_parte AS partNumber,
        trd.desc_articulo AS description,
        trd.id_proyecto AS projectId,
        trd.tipo_maquinado AS machineType, 
        tr.num_req AS rfqNumber,
        tr.id_tiporeq AS rfqType,
        tu.nom_user AS createdBy,
        tr.fecha_registro AS createdAt,
        tr.Id_Estatus AS statusCode,
        me.Desc_Estatus AS sysStatusText
      FROM tb_req_deta trd
      INNER JOIN tb_requisicion tr ON tr.id_req = trd.id_req
      LEFT JOIN tb_user tu ON tu.id_user = tr.id_usuario 
      LEFT JOIN Maquinados_Estatus me ON me.Id_Estatus = tr.Id_Estatus 
      ${whereClause}
      ORDER BY tr.fecha_registro DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    return resultQuery.recordset;
  }catch(e){
    throw e;
  }
}

export async function getTotalItemsFromRequisition(globalFilter: string | null = null, advancedFilter: AdvancedFilter | null = null): Promise<number> {
  try {
    await connection.connect();
    let whereClause = '';

    if(globalFilter && !advancedFilter){
      whereClause = `
        WHERE LOWER(trd.no_parte) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.desc_articulo) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.id_proyecto) LIKE '%' + @globalFilter + '%'
          OR LOWER(trd.tipo_maquinado) LIKE '%' + @globalFilter + '%'
          OR LOWER(tr.num_req) LIKE '%' + @globalFilter + '%'
      `;
    }

    if(advancedFilter) {
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'between'){
        const [startDate, endDate] = advancedFilter.userInput as Date[];
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) BETWEEN '${startDate.toISOString().slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'equals'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) = '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'greater'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) > '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'created_date' && advancedFilter.operator === 'less'){
        const createdDate = advancedFilter.userInput as Date;
        whereClause = `
          WHERE CONVERT(date, tr.fecha_registro) < '${createdDate.toISOString().slice(0, 10)}'
        `;
      }
      if(advancedFilter.column === 'rfq_state'){
        const rfqState = advancedFilter.userInput as string;
        whereClause = `
          WHERE tr.id_estatus = '${rfqState}'
        `;
      }
      if(advancedFilter.column === 'rfq_type'){
        const rfqType = advancedFilter.userInput as string;
        whereClause = `
          WHERE tr.id_tiporeq = '${rfqType}'
        `;
      }

      if(globalFilter) {
        whereClause += `
          AND (LOWER(trd.no_parte) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.desc_articulo) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.id_proyecto) LIKE '%' + @globalFilter + '%'
            OR LOWER(trd.tipo_maquinado) LIKE '%' + @globalFilter + '%'
            OR LOWER(tr.num_req) LIKE '%' + @globalFilter + '%')
        `;
      }
    }

    console.log('whereClause', whereClause);
    
    globalFilter = globalFilter?.toLowerCase() || null;
    const resultQuery = await connection
    .request()
    .input('globalFilter', globalFilter)
    .query(`
      SELECT COUNT(tr.num_req) AS totalItems
      FROM tb_req_deta trd
      INNER JOIN tb_requisicion tr ON tr.id_req = trd.id_req
      ${globalFilter 
        ? whereClause
        : ''
      }
      GROUP BY tr.num_req
    `);

    return resultQuery.recordset.length;
  }catch(e){
    throw e;
  }
}


export async function getRFQsData(
  offset: number = 0, 
  limit: number = 300, 
  globalFilter: string | null = null,
  advancedFilter: AdvancedFilter | null = null
) : Promise<RFQsData> 
{
  try {
    const sapItems = await getDataFromSapReport();
    const requisitionItems = await getItemsFromRequisition(offset, limit, globalFilter, advancedFilter);

    const itemsReport: ItemReport[] = requisitionItems.reduce((acc: ItemReport[], item: ItemRequisition) => {
      const itemReport: ItemReport = {
        ...item, 
        sapPartNumber: null,
        sapDescription: null,
        poDate: null,
        poQuantity: null,
        warehouseTicket: null,
        warehouseTicketDate: null,
        warehouseTicketQuantity: null,
        registerSap: -2,
        stateText: '',
        supplier: '',
        poStatus: null,     
        poNumber: null,
        deliveryDate: null,   
      };

      const sapElements = sapItems.filter(
        (sapItem: SapRecord) => {
          if(!sapItem["Numero de Fabricante"] || !sapItem.Proyecto) return false;

          const sapPartNumber = sapItem["Numero de Fabricante"].trim().toLowerCase()
          const sapSupplierPartNumber = sapItem['Código de Artículo'].trim().toLowerCase();
          const itemPartNumber = item.partNumber.trim().toLowerCase()
          const sapProject = sapItem.Proyecto.trim().toLowerCase()
          const itemProject = item.projectId.trim().toLowerCase()

          return (sapPartNumber.includes(itemPartNumber) || sapSupplierPartNumber.includes(itemPartNumber))&& sapProject === itemProject;
        }
      );

      if(sapElements.length === 0) {
        itemReport.registerSap = 0;
        itemReport.stateText = 'Sin registro SAP';
        
        acc.push(itemReport);
        return acc;
      } 

      sapElements.forEach((sapItem) => {
        const newItemReport: ItemReport = {
          ...item, 
          sapPartNumber: sapItem['Código de Artículo'],
          sapDescription: sapItem['Descripción Artículo'] ? sapItem['Descripción Artículo'].trim() : null,
          poDate: sapItem['Fecha Orden'] ? formatStringToDate(sapItem['Fecha Orden']) : null,
          poQuantity: sapItem['Cantidad Ordenada'] ? parseFloat(sapItem['Cantidad Ordenada']) : null,
          warehouseTicket: sapItem['Número Recepción(es)'] ? sapItem['Número Recepción(es)'].trim() : null,
          warehouseTicketDate: sapItem['Fecha Recepción'] ? formatStringToDate(sapItem['Fecha Recepción']) : null,
          warehouseTicketQuantity: sapItem['Cantidad Recibida'] ? parseFloat(sapItem['Cantidad Recibida']) : null,
          poNumber: sapItem['Número Orden'] ? sapItem['Número Orden'].trim() : null,
          registerSap: -2,
          stateText: '',
          supplier: sapItem['Nombre Proveedor'] ? sapItem['Nombre Proveedor'].trim() : '',
          poStatus: sapItem['Estatus OC'] ? sapItem['Estatus OC'].trim() : null,
          deliveryDate: sapItem['Fecha Promesa de Entrega'] ? formatStringToDate(sapItem['Fecha Promesa de Entrega']) : null,
        };
        
        if(sapItem['RFQ-Sys'].trim().toLowerCase() === item.rfqNumber.trim().toLowerCase()) {
          newItemReport.registerSap = 2;
          newItemReport.stateText = 'Registrado en SAP';
        }else{
          newItemReport.registerSap = 1;
          newItemReport.stateText = 'En SAP sin RFQ';
        }

        acc.push(newItemReport);
      });

      return acc;
    }, []);

    return {
      items: itemsReport,
      unmatchedSapItems: sapItems,
    };

  } catch (error) {
    throw error;
  }
}

export async function getRFQTypes(): Promise<string[]> {
  try {
    await connection.connect();

    const resultQuery = await connection
    .request()
    .query(`
      SELECT tr.id_tiporeq AS rfqType
      FROM tb_requisicion tr
      GROUP BY tr.id_tiporeq
    `);

    return resultQuery.recordset.map(row => row.rfqType);
  } catch (error) {
    throw error;
  }
}