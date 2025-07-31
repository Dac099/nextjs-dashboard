'use server';
import connection from '@/services/database';
import { buildWhereClause } from '@/utils/helpers';
import type { ItemReport, AdvancedFilter } from '@/utils/types/requisitionsTracking';

export async function getRFQsData(
  offset: number = 0, 
  limit: number = 300, 
  globalFilter: string | null = null,
  advancedFilter: AdvancedFilter | null = null
) : Promise<{items: ItemReport[], count: number}> 
{
  try {
    await connection.connect();
    const totalItemsQuery = await connection
      .request()
      .query(`
        SELECT
          COUNT(tr.num_req) AS totalItems    
        FROM tb_req_deta trd
        INNER JOIN tb_requisicion tr ON tr.id_req = trd.id_req
        LEFT JOIN tb_user tu ON tu.id_user = tr.id_usuario 
        LEFT JOIN Maquinados_Estatus me ON me.Id_Estatus = tr.Id_Estatus
        LEFT JOIN FileDataCache fdc 
          ON (
            TRIM(tr.num_req) = fdc.rfqSys AND 
            (
              TRIM(trd.no_parte) = fdc.manufacturerNumber OR
              TRIM(trd.no_parte) = fdc.itemCode
            ) AND 
            TRIM(trd.id_proyecto) = fdc.project
          ) OR  
          (
            (
              TRIM(trd.no_parte) = fdc.manufacturerNumber OR
              TRIM(trd.no_parte) = fdc.itemCode
            ) AND 
            TRIM(trd.id_proyecto) = fdc.project
          )
        GROUP BY tr.num_req
      `);
    const itemsQuery = await connection
      .request()
      .input('offset', offset)
      .input('limit', limit)
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
          me.Desc_Estatus AS sysStatusText,  
          fdc.itemCode AS sapPartNumber,
          fdc.itemDescription AS sapDescription,
          fdc.orderDate AS poDate,
          fdc.promisedDeliveryDate AS deliveryDate,
          fdc.orderedQuantity AS poQuantity,
          fdc.poStatus,
          fdc.orderNumber AS poNumber,
          fdc.receiptNumbers AS warehouseTicket,
          fdc.receivedDate AS warehouseTicketDate,
          fdc.receivedQuantity AS warehouseTicketQuantity,
          fdc.vendorName AS supplier,
          fdc.rfqSys AS sapRfq  
        FROM tb_req_deta trd
        INNER JOIN tb_requisicion tr ON tr.id_req = trd.id_req
        LEFT JOIN tb_user tu ON tu.id_user = tr.id_usuario 
        LEFT JOIN Maquinados_Estatus me ON me.Id_Estatus = tr.Id_Estatus
        LEFT JOIN FileDataCache fdc 
          ON (
            TRIM(tr.num_req) = fdc.rfqSys AND 
            (
              TRIM(trd.no_parte) = fdc.manufacturerNumber OR
              TRIM(trd.no_parte) = fdc.itemCode
            ) AND 
            TRIM(trd.id_proyecto) = fdc.project
          ) OR  
          (
            (
              TRIM(trd.no_parte) = fdc.manufacturerNumber OR
              TRIM(trd.no_parte) = fdc.itemCode
            ) AND 
            TRIM(trd.id_proyecto) = fdc.project
          )
        ORDER BY tr.fecha_registro DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    return {
      items: itemsQuery.recordset,
      count: totalItemsQuery.recordset.length
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