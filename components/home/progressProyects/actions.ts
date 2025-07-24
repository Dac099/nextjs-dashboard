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
    const requisitionItems = await getItemsFromRequisition(offset, limit);

    const itemsReport: ItemReport[] = requisitionItems.reduce((acc: ItemReport[], item: ItemRequisition) => {
      let itemReport: ItemReport = {
        ...item, 
        sapPartNumber: null,
        sapDescription: null,
        sapUM: null,
        poDate: null,
        poQuantity: null,
        deliveryDate: null,
        warehouseTicket: null,
        warehouseTicketDate: null,
        warehouseTicketQuantity: null,
        warehouse: null,
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
          if(!sapItem["Número de artículo"] || !sapItem.Proyecto) return false;

          const sapPartNumber = sapItem["Número de artículo"].trim().toLowerCase()
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
        sapPartNumber: sapItem['Número de artículo'],
        sapDescription: sapItem.Descripcion ? sapItem.Descripcion.trim() : null,
        sapUM: sapItem.UM ? sapItem.UM.trim() : null,
        poDate: sapItem.FechaOC ? formatStringToDate(sapItem.FechaOC) : null,
        poQuantity: sapItem.CantOC ? parseFloat(sapItem.CantOC) : null,
        deliveryDate: sapItem.FechaPromesa ? formatStringToDate(sapItem.FechaPromesa) : null,
        warehouseTicket: sapItem['EM#'] ? sapItem['EM#'].trim() : null,
        warehouseTicketDate: sapItem.FechaEM ? formatStringToDate(sapItem.FechaEM) : null,
        warehouseTicketQuantity: sapItem.CantEM ? parseFloat(sapItem.CantEM) : null,
        warehouse: sapItem.Almacen ? sapItem.Almacen.trim() : null,
        registerSap: -2,
        stateText: ''
      };

      if(sapItem.RFQSys.trim().toLowerCase() === item.rfqNumber.trim().toLowerCase()) {
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