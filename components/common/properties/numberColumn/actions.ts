'use server';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { ColumnData, ItemData, ItemValue, SubItemData } from '@/utils/types/views';
import { insertNewLog } from '@/actions/logger';

export async function updateNumberColumn(
  item: ItemData | SubItemData,
  column: ColumnData,
  value: Partial<ItemValue>,
  prevValue: string | undefined
): Promise<ItemValue> {
  try {
    await connection.connect();
    const parsedValue = JSON.stringify(value.value);
    const isUpdateValue = value.id !== undefined && value.itemId !== undefined && value.columnId !== undefined;
    //if itemId && columnId from ItemValue is undefined then create a TableValue otherwise update it
    if (isUpdateValue) {
      await connection
        .request()
        .input('id', value.id)
        .input('value', parsedValue)
        .query(`
          UPDATE TableValues 
          SET value = @value, 
            updatedAt = GETDATE() 
          WHERE id = @id`
        );

      await insertNewLog(value.id!, prevValue || '', 'Value', 'UPDATE');

      return {
        id: value.id!,
        columnId: value.columnId!,
        itemId: value.itemId!,
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
        VALUES (@itemId, @columnId, @value)`
      );

    await insertNewLog(
      result.recordset[0].id,
      value.value!,
      'Value',
      'CREATE'
    );

    return {
      id: result.recordset[0].id,
      columnId: result.recordset[0].column_id,
      itemId: result.recordset[0].item_id,
      value: result.recordset[0].value,
    };

  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new CustomError(
      500,
      'Error al conectar a la base de datos',
      'Intente de nuevo o contacte a soporte'
    );
  }
}
