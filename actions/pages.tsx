'use server';
import connection from '@/services/database';
import { Page } from '@/utils/dashboard/types';
import { ViewData, ViewType } from '@/utils/proyectTemplate/types';

export const getPages = async(): Promise<Page[] | undefined> => {
  const query: string = `
    SELECT 
      pg.Page_Id AS id, 
      pg.Name AS name,
      cat.Name AS category,
      vp.View_Id AS viewId
    FROM Page pg 
    LEFT JOIN Category cat ON pg.Category_Id = cat.Category_Id
    LEFT JOIN ViewPage vp ON pg.Page_Id = vp.Page_Id
  `;
  try {
    await connection.connect();
    const resultSet = (await connection.query(query)).recordset;
    return resultSet;
  } catch (error) {
    console.log(error);
  }
};

export const getViewsByPageId = async(id: string): Promise<ViewData[] | Error> => {
  const query: string = `
    SELECT 
      vp.View_Id AS viewId,
      vp.Name AS name, 
      vt.Name AS typeName, 
      vt.Icon AS icon
    FROM ViewPage vp 
    LEFT JOIN View_Type vt ON vp.Type_Id = vt.Type_Id 
    WHERE vp.Page_Id = @pageId
  `;
  try {
    await connection.connect();
    const resultSet = (await connection.request().input('pageId', id).query(query)).recordset;
    return resultSet;
  } catch (error) {
    console.log(error);
    const errorMsg: string = error.message ? error.message : 'SQL Server error while fetching views by page id';
    return new Error(errorMsg);
  }
}

export const getViewTypes = async(): Promise<ViewType[] | Error> => {
  const query: string = 'SELECT vt.Icon as icon, vt.Name as name FROM View_Type vt';
  try {
    await connection.connect();
    const resultSet = await connection.query(query);
    return resultSet.recordset;
  }catch(error){
    console.log(error);
    const errorMsg: string = error.message ? error.message : 'SQL Server error while fetching view types';
    return new Error(errorMsg)
  }
}

export const insertViewPage = async(pageId: string, type: string, name: string): Promise<string | Error> => {
  const query: string = `
    INSERT INTO ViewPage (Page_Id, Type_Id, Name) 
    OUTPUT INSERTED.View_Id 
    VALUES (@pageId, (SELECT Type_Id FROM View_Type WHERE Name = @type), @name)
  `;
  try{
    await connection.connect();
    const resultSet = await connection.request()
      .input('pageId', pageId)
      .input('type', type)
      .input('name', name)
      .query(query);

    if(resultSet.rowsAffected[0] === 0) throw new Error('SQL Error on insert ViewPage record');
    const insertedId = resultSet.recordset[0].View_Id;
    return insertedId;
  }catch(error){
    console.log(error);
    const errorMsg: string = error.message ? error.message : 'SQL Server error while fetching view types';
    return new Error(errorMsg)
  }
}

export const getPageView = async(pageId: string): Promise<ViewData[] | Error> => {
  const query: string = `
    SELECT 
      vp.View_Id AS viewId
    FROM ViewPage vp 
    LEFT JOIN View_Type vt ON vp.Type_Id = vt.Type_Id 
    WHERE vp.Page_Id = @pageId
  `;
  try {
    await connection.connect();
    const resultSet = await connection.request().input('pageId', pageId).query(query);
    return resultSet.recordset;
  } catch (error) {
    console.log(error);
    const errorMsg: string = error.message ? error.message : 'SQL Server error while fetching view types';
    return new Error(errorMsg)
  }
}