'use server';
import connection from '@/services/database';
import { ItemValue, ItemData, ColumnData, SubItemData } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';
import { insertNewLog } from '@/actions/logger';

export async function updateDefinedDateValue(
  item: ItemData | SubItemData,
  column: ColumnData,
  value: Partial<ItemValue>,
  prevValue: string | undefined
): Promise<ItemValue> {
  try {
    await connection.connect();
    const parsedValue = value.value;
    const isUpdateValue = value.itemId !== undefined && value.columnId !== undefined && value.id !== undefined;

    if (isUpdateValue) {
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

      await insertNewLog(value.id!, prevValue || '', 'Value', 'UPDATE');

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

    await insertNewLog(
      result.recordset[0].id,
      value.value!,
      'Value',
      'CREATE'
    );

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
