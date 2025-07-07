'use server';
import { ColumnData, ItemData, ItemValue, SubItemData } from '@/utils/types/views';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { insertNewLog } from '@/actions/logger';

export async function updateTextColumnValue(
  item: ItemData | SubItemData,
  column: ColumnData,
  value: Partial<ItemValue>,
  prevValue: string | undefined
): Promise<ItemValue> {
  try {
    await connection.connect();
    const isUpdateOperation = value.id !== undefined && value.itemId !== undefined && value.columnId !== undefined;

    if (isUpdateOperation) {
      await connection
        .request()
        .input('id', value.id)
        .input('value', JSON.stringify(value.value))
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
        value: value.value!,
      };
    }

    const result = await connection
      .request()
      .input('itemId', item.id)
      .input('columnId', column.id)
      .input('value', JSON.stringify(value.value))
      .query(`
        INSERT INTO TableValues (item_id, column_id, value)
        OUTPUT INSERTED.*
        VALUES (@itemId, @columnId, @value)
      `);

    await insertNewLog(result.recordset[0].id, value.value!, 'Value', 'CREATE');

    return {
      id: result.recordset[0].id,
      itemId: item.id,
      columnId: column.id,
      value: value.value!,
    };
  } catch (error) {
    console.log('Error while connecting to the database', error);
    throw new CustomError(500, 'Error al conectar con la base de datos', 'Intente de nuevo o contacte a soporte')
  }
}
