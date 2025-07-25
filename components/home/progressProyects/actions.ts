'use server';
import connection from '@/services/database';
import { formatFileData, formatStringToDate } from '@/utils/helpers';
import { getFileData } from '@/app/(dashboard)/sap-reports/actions';
import type { ItemRequisition, SapRecord, ItemReport, RFQsData } from '@/utils/types/requisitionsTracking';

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

async function getItemsFromRequisition(offset: number, limit: number): Promise<ItemRequisition[]> {
  try {
    //TODO: Get data from Maquinados
    await connection.connect();
    const resultQuery = await connection
    .request()
    .input('limit', limit)
    .input('offset', offset)
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
      ORDER BY tr.fecha_registro DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    return resultQuery.recordset;
  }catch(e){
    throw e;
  }
}

export async function getRFQsData(offset: number = 0, limit: number = 300) : Promise<RFQsData> 
{
  try {
    const sapItems = await getDataFromSapReport();
    console.log(sapItems)
    const requisitionItems = await getItemsFromRequisition(offset, limit);

    const itemsReport: ItemReport[] = requisitionItems.reduce((acc: ItemReport[], item: ItemRequisition) => {
      let itemReport: ItemReport = {
        ...item, 
        sapPartNumber: null,
        sapDescription: null,
        poDate: null,
        poQuantity: null,
        warehouseTicket: null,
        warehouseTicketDate: null,
        warehouseTicketQuantity: null,
        registerSap: -2,
        stateText: ''
      };

      if(item.rfqType.trim() === 'Maqui' && item.machineType.trim() === 'Interno'){
        itemReport.registerSap = -1;
        itemReport.stateText = 'Maquinado Interno';

        acc.push(itemReport);
        return acc;
      }

      const indexSapItem = sapItems.findIndex(
        (sapItem: SapRecord) => {
          if(!sapItem["Numero de Fabricante"] || !sapItem.Proyecto) return false;

          const sapPartNumber = sapItem["Numero de Fabricante"].trim().toLowerCase()
          const itemPartNumber = item.partNumber.trim().toLowerCase()
          const sapProject = sapItem.Proyecto.trim().toLowerCase()
          const itemProject = item.projectId.trim().toLowerCase()

          return sapPartNumber.includes(itemPartNumber) && sapProject === itemProject;
        }
      );

      if(indexSapItem === -1) {
        itemReport.registerSap = 0;
        itemReport.stateText = 'Sin registro SAP';
        
        acc.push(itemReport);
        return acc;
      } 

      const sapItem = sapItems[indexSapItem];
      itemReport = {
        ...item, 
        sapPartNumber: sapItem['Código de Artículo'],
        sapDescription: sapItem['Descripción Artículo'] ? sapItem['Descripción Artículo'].trim() : null,
        poDate: sapItem['Fecha Orden'] ? formatStringToDate(sapItem['Fecha Orden']) : null,
        poQuantity: sapItem['Cantidad Ordenada'] ? parseFloat(sapItem['Cantidad Ordenada']) : null,
        warehouseTicket: sapItem['Número Recepción(es)'] ? sapItem['Número Recepción(es)'].trim() : null,
        warehouseTicketDate: sapItem['Fecha Recepción'] ? formatStringToDate(sapItem['Fecha Recepción']) : null,
        warehouseTicketQuantity: sapItem['Cantidad Recibida'] ? parseFloat(sapItem['Cantidad Recibida']) : null,
        registerSap: -2,
        stateText: ''
      };

      if(sapItem['RFQ-Sys'].trim().toLowerCase() === item.rfqNumber.trim().toLowerCase()) {
        itemReport.registerSap = 2;
        itemReport.stateText = 'Registrado en SAP';
      }else{
        itemReport.registerSap = 1;
        itemReport.stateText = 'En SAP sin RFQ';
      }

      sapItems.splice(indexSapItem, 1);

      acc.push(itemReport);
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