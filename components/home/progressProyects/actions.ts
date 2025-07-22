'use server';
import connection from '@/services/database';
import type { ProyectDataType, PurchaseItemType, PurchaseOrderType } from '@/schemas/homeSchemas';
import { transformDateObjectToLocalString, formatFileData } from '@/utils/helpers';
import { getFileData } from '@/app/(dashboard)/sap-reports/actions';

export async function getProjects(): Promise<ProyectDataType[]> {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .query(`
        SELECT 
          tp.id_proyect AS id,
          tp.nom_proyecto AS name, 
          tu.nom_user AS createdBy,
          tpt.nom_tipo AS type,
          tc.nom_cliente AS client,
          tp.fecha_inicio AS startDate,
          tp.fecha_fin AS endDate,
          tp.num_cot AS quoteNumber
        FROM tb_proyect tp 
        LEFT JOIN tb_cliente tc ON tc.id_cliente = tp.id_cliente 
        LEFT JOIN tb_user tu ON tu.id_user = tp.id_user 
        LEFT JOIN tb_pro_tipo tpt on tpt.id_tipo_pro = tp.id_tipo_pro  
        ORDER BY tp.fecha_registro DESC
      `);

    //Get data from file 
    const [fileData] = await getFileData();
    const formatedFileData = formatFileData(fileData);
    const headerValues = formatedFileData[0];
    const values = formatedFileData.slice(1).map((row) => {
      return Object.fromEntries(row.map((value, i) => [headerValues[i], value]));
    });

    const PurchaseOrders = values.reduce((acc, item) => {
      const purchaseIndex = acc.findIndex((order) => order.purchaseNumber === item['SOL#']);

      if(purchaseIndex < 0){
        acc.push({
          purchaseNumber: item['SOL#'],
          deliveryDate: item['FechaPromesa'],
          projectNumber: item['Proyecto'],
          requestedDate: item['FechaSOL'],
          purchaseRequester: item['Solicitante'],
          sapUser: item['Usuario'],
          sapUserName: item['Nombre de usuario'],
          rfqNumber: item['RFQSys'],
          items: [{
            number: item['Número de artículo'],
            description: item['Descripcion'],
            measurementUnit: item['UM'],
            quantity: item['CantSolicitada'],
            placementFolio: item['EM#'] || undefined,
            placementDate: item['FechaEM'] || undefined,
            placementQuantity: item['CantEM'] || undefined,
            requestedPurchase: item['OC#'] || undefined
          }]
        });

        return acc;
      }
      
      acc[purchaseIndex].items.push({
        number: item['Número de artículo'],
        description: item['Descripcion'],
        measurementUnit: item['UM'],
        quantity: item['CantSolicitada'],
        placementFolio: item['EM#'] || undefined,
        placementDate: item['FechaEM'] || undefined,
        placementQuantity: item['CantEM'] || undefined,
        requestedPurchase: item['OC#'] || undefined
      } as PurchaseItemType);

      return acc;
    }, [] as PurchaseOrderType[]);

    return result.recordset.map((project) => ({
      ...project,
      orders: PurchaseOrders.filter(order => order.projectNumber === project.id.trim()), 
      startDate: transformDateObjectToLocalString(project.startDate, false),
      endDate: transformDateObjectToLocalString(project.endDate, false),
    }));
  } catch (error) {
    throw error;
  }
};

export async function getProjectTypes(): Promise<string[]> {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .query(`
        SELECT 
          tpt.nom_tipo AS type
        FROM tb_pro_tipo tpt
      `);

    return result.recordset.map((project) => project.type);
  } catch (error) {
    throw error;
  }
}