'use server';
import connection from '@/services/database';
import type { ManagersId, ManagersData } from '@/utils/types/projectDetail';
import { ItemValue } from '@/utils/types/views';

export async function getManagersData(managers: ManagersId): Promise<ManagersData[]> {
  if(Object.values(managers).every(id => id === null)) throw new Error('No hay recursos asignados a este proyecto');

  try {
    await connection.connect();
    const parsedManagersId = Object.values(managers).filter(id => id !== null).join(',') as string;

    const result = await connection
      .request()
      .query(`
        SELECT 
          tu.id_user AS id,
          tu.nom_user AS name, 
          tu.usuario AS username,
          tp.nom_perfil AS profile,
          ta.nom_area AS area
        FROM tb_user tu
        INNER JOIN tb_profile tp ON tp.id_perfil = tu.id_profile
        INNER JOIN tb_area ta ON ta.id_area = tu.id_depto
        WHERE tu.id_user IN (${parsedManagersId})
      `);

    return result.recordset;
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al obtener los datos');
  }
}

export async function getValuesLinkedToItem(itemId: string): Promise<ItemValue[]> {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('itemId', itemId)
      .query(`
        SELECT
          tv.id AS id,
          tv.item_id AS itemId,
          tv.column_id AS columnId,
          tv.value AS value 
        FROM TableValues tv
        INNER JOIN Columns c ON c.id = tv.column_id
        WHERE tv.item_id = @itemId
          AND (c.type = 'user'
          OR (c.type = 'text' AND c.name = 'PM'))
      `)

    return result.recordset;

  } catch (error) {
    console.log(error);
    throw new Error();
  }
}