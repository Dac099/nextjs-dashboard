'use server';
import connection from '@/services/database';
import { ItemValue, ItemData, ColumnData } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function setTimeLineValue(item: ItemData, column: ColumnData, value: Partial<ItemValue>): Promise<ItemValue> {
  try {
    await connection.connect();
    const isUpdateItem = value.id !== undefined;

    if(isUpdateItem){
      await connection
        .request()
        .input('value', value.value)
        .input('id', value.id)
        .query(`
          UPDATE TableValues
          SET value = @value,
            updated_at = GETDATE()
          WHERE id = @id
        `);
      return value as ItemValue;
    }

    const result = await connection
      .request()
      .input('itemId', item.id)
      .input('columnId', column.id)
      .input('value', value.value)
      .query(`
        INSERT INTO TableValues (item_id, column_id, value)
        OUTPUT inserted.id
        VALUES (@itemId, @columnId, @value);
      `);
    
    return {
      id: result.recordset[0].id,
      itemId: item.id,
      columnId: column.id,
      value: value.value
    } as ItemValue;

  } catch (error) {
    console.error(error);
    throw new CustomError(
      500, 
      'Error al actualizar el valor de timeline', 
      'Intente de nuevo o recargue la página'
  );
  }
}