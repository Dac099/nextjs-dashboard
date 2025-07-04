'use server';
import connection from '@/services/database';
import { insertNewLog } from '@/actions/logger';

export async function updateItemName(itemId: string, newName: string, prevName: string) {
  try {
    await connection.connect();
    await connection
      .request()
      .input('itemId', itemId)
      .input('newName', newName)
      .query(`
        UPDATE Items 
        SET name = @newName,
          updatedAt = GETDATE() 
        WHERE id = @itemId  
      `);
    await insertNewLog(itemId, prevName, 'Item', 'UPDATE');
  } catch (error) {
    console.log('ERROR on update item name', error);
    throw new Error('Ocurrió un error al actualizar el item', { cause: error });
  }
}
export async function deleteItem(itemId: string) {
  try {
    await connection.connect();
    await connection
      .request()
      .input('itemId', itemId)
      .query(`
        UPDATE Items
        SET deleted_at = GETDATE()
        WHERE id = @itemId
      `);
    await insertNewLog(itemId, '', 'Item', 'DELETE');
  } catch (error) {
    console.log('ERROR on delete item', error);
    throw new Error('Ocurrió un error al eliminar el item', { cause: error });
  }
}
