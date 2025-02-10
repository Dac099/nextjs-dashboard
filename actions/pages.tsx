'use server';
import connection from '@/services/database';
import { Page } from '@/utils/dashboard/types';

export const getPages = async(): Promise<Page[] | undefined> => {
  const query: string = `
    SELECT 
      pg.Page_Id AS id, 
      pg.Name AS name,
      cat.Name AS category
    FROM Page pg 
    LEFT JOIN Category cat ON pg.Category_Id = cat.Category_Id
  `;
  try {
    await connection.connect();
    const resultSet = (await connection.query(query)).recordset;
    return resultSet;
  } catch (error) {
    console.log(error);
  }
};