'use server';
import connection from '@/services/database';
import { ItemValue, ItemData, ColumnData, SubItemData } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';
import { insertNewLog } from '@/actions/logger';

export async function setTimeLineValue(
  item: ItemData | SubItemData,
  column: ColumnData,
  value: Partial<ItemValue>,
  prevValue: string | undefined
): Promise<ItemValue> {
  try {
    await connection.connect();
    const isUpdateItem = value.id !== undefined;

    if (isUpdateItem) {
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

      await insertNewLog(value.id!, prevValue || '', 'Value', 'UPDATE');
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

    await insertNewLog(result.recordset[0].id, value.value!, 'Value', 'CREATE');

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
