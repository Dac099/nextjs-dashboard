'use server';
import connection from '@/services/database';
import { insertNewLog } from '@/actions/logger';
import sql from 'mssql';
import { ItemValue, SubItemData } from '@/utils/types/views';

export async function updateItemName(itemId: string, newName: string, prevName: string, isSubItem: boolean) {
  try {
    await connection.connect();
    await connection
      .request()
      .input('itemId', itemId)
      .input('newName', newName)
      .query(`
        UPDATE ${isSubItem ? 'SubItems' : 'Items'} 
        SET name = @newName,
          updated_at = GETDATE() 
        WHERE id = @itemId  
      `);
    await insertNewLog(itemId, prevName, 'Item', 'UPDATE');
  } catch (error) {
    console.log('ERROR on update item name', error);
    throw new Error('Ocurrió un error al actualizar el item', { cause: error });
  }
}

export async function deleteItem(itemId: string, isSubItem: boolean) {
  try {
    await connection.connect();
    const transaction = new sql.Transaction(connection);
    await transaction.begin();
    try {
      const updateResult = await transaction
        .request()
        .input('itemId', itemId)
        .query(`
          UPDATE ${isSubItem ? 'SubItems' : 'Items'}
          SET deleted_at = GETDATE()
          WHERE id = @itemId
        `);

      if (updateResult.rowsAffected[0] === 0) {
        throw new Error('The item was not deleted');
      }

      await transaction
        .request()
        .input('itemId', itemId)
        .query(`
          UPDATE TableValues
          SET deleted_at = GETDATE()
          WHERE item_id = @itemId  
        `);

      await insertNewLog(itemId, '', 'Item', 'DELETE');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log('ERROR on delete item', error);
      throw new Error('Ocurrió un error al eliminar el item', { cause: error });
    }
  } catch (error) {
    console.log('Error on DB connection while deleting item', error)
    throw new Error('Error al conectar a la BD, inténtelo más tarde');
  }
}

export async function getSubItems(itemId: string): Promise<SubItemData[]> {
  try {
    await connection.connect();
    const subItemsResult = await connection
      .request()
      .input('itemId', itemId)
      .query(`
        SELECT 
          id,
          name,
          item_parent AS itemParentId
        FROM SubItems  
        WHERE item_parent = @itemId
          AND deleted_at IS NULL
      `);

    const valuesResult = await connection
      .request()
      .input('itemId', itemId)
      .query(`
        SELECT
          id,
          item_id AS itemId,
          column_id AS columnId,
          value
        FROM TableValues
        WHERE item_id IN (SELECT id from SubItems WHERE item_parent = @itemId)
          AND deleted_at IS NULL
      `);

    const subItems: Omit<SubItemData, 'values'>[] = subItemsResult.recordset;
    const values: ItemValue[] = valuesResult.recordset;
    const subItemsWithValues: SubItemData[] = subItems.map((subItem) => {
      const subItemValues = values.filter((value) => value.itemId === subItem.id);
      return {
        ...subItem,
        values: subItemValues,
      };
    });

    return subItemsWithValues;
  } catch (error) {
    throw error;
  }
}
