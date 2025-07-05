'use server';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { insertNewLog } from '@/actions/logger';

export async function addNewGroup(boardId: string, groupName: string, color: string): Promise<string> {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('name', groupName)
      .input('color', color)
      .input('boardId', boardId)
      .query(`
        INSERT INTO Groups (name, color, position, board_id)  
        OUTPUT inserted.id
        VALUES (
          @name, 
          @color, 
          (SELECT ISNULL(MAX(position), 0) + 1 FROM Groups WHERE board_id = @boardId),
          @boardId
        )
      `);

    await insertNewLog(result.recordset[0].id, groupName, 'Group', 'CREATE');
    return result.recordset[0].id;
  } catch (error) {
    console.error('Error adding group:', error);
    throw new CustomError(500, 'Error agregando un grupo', 'Itente de nuevo o contacte a sistemas');
  }
}
