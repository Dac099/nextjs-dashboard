'use server';
import connection from '@/services/database';
import { ItemValue, ItemData, ColumnData } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function updateDefinedDateValue(item: ItemData, column: ColumnData, value: Partial<ItemValue>): Promise<ItemValue> {
  try {
    await connection.connect();
    const parsedValue = value.value;
    const isUpdateValue = value.itemId !== undefined && value.columnId !== undefined && value.id !== undefined;    

    if(isUpdateValue){
      await connection
        .request()
        .input('id', value.id)
        .input('value', parsedValue)
        .query(`
          UPDATE TableValues
          SET value = @value,
              updated_at = GETDATE()
          WHERE id = @id  
        `);
      
      return {
        id: value.id!,
        itemId: value.itemId!,
        columnId: value.columnId!,
        value: value.value!
      };
    }

    const result = await connection
      .request()
      .input('itemId', item.id)
      .input('columnId', column.id)
      .input('value', parsedValue)
      .query(`
        INSERT INTO TableValues (item_id, column_id, value)
        OUTPUT INSERTED.*
        VALUES (@itemId, @columnId, @value)
      `);

    return {
      id: result.recordset[0].id,
      itemId: item.id,
      columnId: column.id,
      value: value.value!
    };
  } catch (error) {
    console.log('Error updating date column value:', error);
    throw new CustomError(500, 'Error al actualizar el valor del item', 'Intente nuevamente o llame a sistemas');
  }
}