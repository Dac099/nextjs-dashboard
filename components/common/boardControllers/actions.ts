'use server';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { insertNewLog } from '@/actions/logger';
import { formatFileDataToObject } from '@/utils/helpers';
import { linkedUserProject, UserData } from '@/utils/types/items';

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

export async function getListedUsersInProjects(boardId: string) {
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('boardId', boardId)
      .query(`
        SELECT tv.value
        FROM TableValues tv
        INNER JOIN Columns c ON c.id = tv.column_id
        WHERE c.board_id = @boardId
          AND c.type = 'user'
          AND tv.deleted_at IS NULL
          AND c.deleted_at IS NULL
      `);

    return formatFileDataToObject(result.recordset.map(row => row.value));
  } catch (error) {
    throw error;
  }
}

export async function getLinkedProjects(usersData: UserData[]): Promise<linkedUserProject[]> 
{
  try {
    await connection.connect();
    const userIds = usersData.map(user => user.id);
    
    const result = await connection
      .request()
      .query(`
        SELECT 
          i.id as projectId,
          i.name as projectName,
          SUBSTRING(
            tv.value, 
            CHARINDEX('"id":', tv.value) + 5, 
            CHARINDEX(',', tv.value, CHARINDEX('"id":', tv.value)) - (CHARINDEX('"id":', tv.value) + 5)
          ) as userId
        FROM Items i  
        INNER JOIN TableValues tv ON tv.item_id = i.id
        INNER JOIN Columns c ON c.id = tv.column_id
        WHERE c.type = 'user'
          AND tv.deleted_at IS NULL
          AND c.deleted_at IS NULL
          AND i.deleted_at IS NULL
          AND SUBSTRING(
                tv.value, 
                CHARINDEX('"id":', tv.value) + 5,
                CHARINDEX(',', tv.value, CHARINDEX('"id":', tv.value)) - (CHARINDEX('"id":', tv.value) + 5)
              ) IN (${userIds.map(id => `'${id}'`).join(', ')})
      `);
    
    const linkedProjects = usersData.reduce((acc, user: UserData) => {
      const userIndex = acc.findIndex(item => item.user.id === user.id);
      
      if(userIndex === -1){
        acc.push({
          user,
          projects: result.recordset
            .filter(row => row.userId == user.id)
            .map(row => ({
              projectName: row.projectName,
              projectId: row.projectId
            }))
        });
      }

      return acc;
    }, [] as linkedUserProject[]);

    return linkedProjects;
  } catch (error) {
    throw error;
  }
}