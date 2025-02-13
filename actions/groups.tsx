'use server';
import connection from '@/services/database';
import type { GroupData } from '@/utils/common/types';

export const fetchGroups = async(pageId: string): Promise<GroupData[] | Error> => {
  try {
    await connection.connect();
    const query: string = `
      SELECT 
        g.Group_Id AS id,
        g.Title AS title,
        g.Color AS color
      FROM Grupo g
      WHERE g.Page_Id = @pageId;
    `;
    const result = (await connection.request().input('pageId', pageId).query(query)).recordset;
    return result;
  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching groups by page id';
    return new Error(errorMsg);
  }
};

export const getGroupItems = async(groupId: string): Promise<ItemData[] | Error> => {
  const query: string = ``;
  try {
    await connection.connect();
  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching groups by page id';
    return new Error(errorMsg);
  }
}