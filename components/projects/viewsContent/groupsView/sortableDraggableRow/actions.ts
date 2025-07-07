'use server';
import connection from '@/services/database';
import { SubItemData } from '@/utils/types/views';

export async function createSubItem(itemName: string, parentId: string): Promise<SubItemData> {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('itemName', itemName)
      .input('parentId', parentId)
      .query(`
        INSERT INTO SubItems (name, item_parent)  
        OUTPUT INSERTED.id
        VALUES(@itemName, @parentId)
      `);

    return {
      id: result.recordset[0].id,
      name: itemName,
      itemParentId: parentId,
      values: []
    };
  } catch (error) {
    throw error;
  }
}
