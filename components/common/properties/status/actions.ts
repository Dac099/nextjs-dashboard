'use server';
import connection from '@/services/database'
import sql from 'mssql';
import { StatusValue } from '@/utils/types/groups';
import { ItemData, ColumnData } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function setStatusValue(tag: StatusValue, item: ItemData, column: ColumnData) {
  try {
    await connection.connect();
    const recordOnTableValue: boolean = await itemExists(item.id, column.id, connection);

    if(recordOnTableValue) {
      await updateTableValue(tag.value, item.id, column.id, connection);
      return;
    }

    await createTableValue(tag.value, item.id, column.id, connection);
    return;

  } catch (error) {
    console.error('Error setting status value:', error);
    throw new CustomError(500, 'Error al actualizar el estado', 'Intente de nuevo o llame a sistemas');
  }
}

export async function addNewStatusValue(item: ItemData, column: ColumnData, value: {color: string, text: string}): Promise<StatusValue>{
  try {
    await connection.connect();
    const statusValueId = await addStatusValueRecord(value, connection, column.id);

    return {
      columnId: column.id,
      id: statusValueId,
      value: JSON.stringify(value),
    };
  } catch (error) {
    console.error('Error on adding new status value:', error);
    throw new CustomError(500, 'Error al agregar el nuevo estado', 'Intente de nuevo o llame a sistemas');
  }
}

export async function deleteStatusValue(value: StatusValue){
  try {
    await connection.connect();
    await connection
      .request()
      .input('value', value.value)
      .query(`
        UPDATE TableValues
        SET deleted_at = GETDATE()
        WHERE value = @value  
      `);
  } catch (error) {
    console.error('Error deleting status value:', error);
    throw new CustomError(500, 'Error al eliminar el estado', 'Intente de nuevo o llame a sistemas');
  }
}

async function itemExists(itemId: string, columnId: string, connection: sql.ConnectionPool): Promise<boolean> {
  const queryRequestExistense = await connection
    .request()
    .input('itemId', itemId)
    .input('columnId', columnId)
    .query(`
      SELECT COUNT(id) AS totalItems 
      FROM TableValues
      WHERE item_id = @itemId 
        AND column_id = @columnId
        AND deleted_at IS NULL
    `);
  return queryRequestExistense.recordset[0].totalItems > 0;
}

async function updateTableValue(value: string, itemId: string, columnId: string, connection: sql.ConnectionPool) {
  await connection
    .request()
    .input('value', value)
    .input('itemId', itemId)
    .input('columnId', columnId)
    .query(`
      UPDATE TableValues 
      SET value = @value, updated_at = GETDATE() 
      WHERE item_id = @itemId 
        AND column_id = @columnId
        AND deleted_at IS NULL
    `);
}

async function createTableValue(value: string, itemId: string, columnId: string, connection: sql.ConnectionPool) {
  await connection
    .request()
    .input('value', value)
    .input('itemId', itemId)
    .input('columnId', columnId)
    .query(`
      INSERT INTO TableValues (value, item_id, column_id) 
      VALUES (@value, @itemId, @columnId)
    `);
}

async function addStatusValueRecord(value: {color: string, text: string}, connection: sql.ConnectionPool, columnId: string) {
  const result = await connection
    .request()
    .input('value', JSON.stringify({ color: value.color, text: value.text }))
    .input('columnId', columnId)
    .query(`
      INSERT INTO TableValues (value, column_id) 
      OUTPUT INSERTED.id
      VALUES (@value, @columnId)
    `);

  return result.recordset[0].id;
}
