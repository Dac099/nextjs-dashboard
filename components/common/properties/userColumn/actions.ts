'use server';
import connection from '@/services/database';
import type { UserData } from '@/utils/types/items';
import { ItemValue } from '@/utils/types/views';

export async function getCurrentActiveUsers(): Promise<UserData[]> {
  try {
    await connection.connect();

    const result = await connection
      .request()
      .query(`
        SELECT 
          tu.id_user as id, 
          tu.usuario as username, 
          tu.nom_user as name,
          ta.nom_area as department
        FROM tb_user tu
        INNER JOIN tb_area ta ON ta.id_area = tu.id_depto
        WHERE tu.edo_user = 1
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

export async function defineUserValue(itemId: string, columnId: string, value: Partial<ItemValue>) {
  try{
    await connection.connect();
    const isUpdateValue = value.id || value.columnId;

    if(isUpdateValue){
      await connection
        .request()
        .input('id', value.id)
        .input('value', value.value)
        .query(`
          UPDATE TableValues
          SET value = @value
          WHERE id = @id  
        `);
      return;
    }

    await connection
      .request()
      .input('itemId', itemId)
      .input('columnId', columnId)
      .input('value', value.value)
      .query(`
        INSERT INTO TableValues (item_id, column_id, value)  
        VALUES (@itemId, @columnId, @value)
      `);

    return;
    
  }catch(error){
    throw error;
  }
}