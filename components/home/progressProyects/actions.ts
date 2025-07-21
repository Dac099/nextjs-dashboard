'use server';
import connection from '@/services/database';
import type { ProyectDataType } from '@/schemas/homeSchemas';
import { transformDateObjectToLocalString } from '@/utils/helpers';

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
      `);

    return result.recordset.map((project) => ({
      ...project,
      requisitions: [], 
      startDate: transformDateObjectToLocalString(project.startDate, false),
      endDate: transformDateObjectToLocalString(project.endDate, false),
    })) as ProyectDataType[];
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