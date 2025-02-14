'use server';
import connection from '@/services/database';
import type { GroupData, ItemData, ItemDetail, PageProperties, PropertyData } from '@/utils/common/types';
import { faker } from '@faker-js/faker';
import { revalidatePath } from 'next/cache';

export const fetchGroups = async(pageId: string): Promise<GroupData[] | Error> => {
  try {
    await connection.connect();
    const query: string = `
      SELECT 
        g.Group_Id AS id,
        g.Title AS title,
        g.Color AS color
      FROM Grupo g
      WHERE g.Page_Id = @pageId
      ORDER BY g.Render_Order
    `;
    const result = (await connection.request().input('pageId', pageId).query(query)).recordset;
    return result;
  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching groups by page id';
    return new Error(errorMsg);
  }
};

export const getPageProperties = async(pageId: string): Promise<PageProperties[] | Error> => {
  const query: string = `
    SELECT	
      pp.PText,
      pp.PNumber,
      pp.PTimeLine, 
      pp.PStatus
    FROM PageProperty pp 
    WHERE pp.Page_Id = @pageId;
  `;	
  try{
    await connection.connect();
    const result = await connection.request().input('pageId', pageId).query(query);
    return result.recordset[0];
  }catch(error){
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching page properties';
    return new Error(errorMsg);
  }
};

export const getGroupItems = async(groupId: string): Promise<ItemData[] | Error> => {
  const query: string = `
    SELECT 
      i.Item_Id AS id, 
      i.Title AS title,
      i.Created_At AS createdAt,
      i.Updated_At AS updatedAt
    FROM Item i
    WHERE i.Group_Id = @groupId
  `;
  try{
    await connection.connect();
    const result = await connection.request().input('groupId', groupId).query(query);
    return result.recordset;
  }catch(error){
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching page properties';
    return new Error(errorMsg);
  }
};

export const getGroupProperties = async(itemId: string): Promise<{userTitle: string, propertyTitle: string}[][] | Error> => {
  const properties: PropertyData[][] = [];
  try{
    const textPropertiesQuery: string = `
      SELECT
        User_Title as userTitle,
        Property_Title as propertyTitle
      FROM PText
      WHERE Item_Id = @itemId
    `;
    const numberPropertiesQuery: string = `
      SELECT 
        User_Title as userTitle,
        Property_Title as propertyTitle
      FROM PNumber
      WHERE Item_Id = @itemId
    `;

    const statusPropertiesQuery: string = `
      SELECT 
        User_Title as userTitle,
        Property_Title as propertyTitle
      FROM PStatus
      WHERE Item_Id = @itemId
    `;

    const timelinePropertiesQuery: string = `
      SELECT 
        User_Title as userTitle,
        Property_Title as propertyTitle
      FROM PTime_Line
      WHERE Item_Id = @itemId
    `;

    await connection.connect();
    const textProperties = connection.request().input('itemId', itemId).query(textPropertiesQuery);
    const numberProperties = connection.request().input('itemId', itemId).query(numberPropertiesQuery);
    const statusProperties = connection.request().input('itemId', itemId).query(statusPropertiesQuery);
    const timelineProperties = connection.request().input('itemId', itemId).query(timelinePropertiesQuery);

    const results = await Promise.all([textProperties, numberProperties, statusProperties, timelineProperties]);
    properties.push(...results.map(result => result.recordset));

    return properties;
  }catch(error){
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) ? error.message : 'SQL Server error while fetching page properties';
    return new Error(errorMsg);
  }
}

export const createGroup = async(pageId: string, viewId: string): Promise<number | Error> => {
  const query: string = `
    INSERT INTO Grupo (Title, Color, Page_Id, Render_Order)
    VALUES (@title, @color, @pageId, 1);
  `;
  const title: string = faker.lorem.word(10);
  const color: string = faker.color.rgb();

  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('title', title)
      .input('color', color)
      .input('pageId', pageId)
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`)
    return result.rowsAffected[0];
  } catch(error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
      ? error.message 
      : 'SQL Server error while fetching page properties';
    return new Error(errorMsg);
  }
}

export async function createFirstItem(pageId: string, view_id: string): Promise<number | Error> {
  const newItemQuery: string = `
    INSERT INTO Item (Group_Id, Title)
    VALUES (@groupId, @title);
  `;

  const findFirstGroup: string = `
    SELECT Group_Id as groupId FROM Grupo WHERE Page_Id = @pageId AND Render_Order = 1;
  `;

  try{
    await connection.connect();

    let response = await connection.request()
      .input('pageId', pageId)
      .query(findFirstGroup);

    if(response.recordset.length === 0){
      await createGroup(pageId, view_id);
      
      response = await connection.request()
      .input('pageId', pageId)
      .query(findFirstGroup)
    }

    const { groupId } = response.recordset[0];

    response = await connection.request()
      .input('groupId', groupId)
      .input('title', faker.lorem.word(10))
      .query(newItemQuery);
    
    revalidatePath(`/projects/${pageId}/${view_id}`);
    return response.rowsAffected[0];

  }catch(error){
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
      ? error.message 
      : 'SQL Server error while fetching page properties';
    return new Error(errorMsg);
  }
}

export async function getItemData(itemId: string): Promise<ItemDetail | Error> {
  const itemTextPropsQuery: string = `
    SELECT 
      PText_Id AS id,
      Value AS value
    FROM PText
    WHERE Item_Id = @itemId;
  `;
  const itemNumberPropsQuery: string = `
    SELECT 
      PNumber_Id AS id,
      Value AS value,
      Format AS format
    FROM PNumber
    WHERE Item_Id = @itemId;
  `;
  const itemStatusPropsQuery: string = `
    SELECT 
      PStatus_Id AS id,
      Value AS value,
      Color AS color
    FROM PStatus
    WHERE Item_Id = @itemId;
  `;
  const itemTimelinePropsQuery: string = `
    SELECT 
      PTime_Id AS id,
      Start_Date AS startDate,
      End_Date AS endDate
    FROM PTime_Line
    WHERE Item_Id = @itemId;
  `;
  const itemChatsQuery: string = `
    SELECT 
      PChat_Id AS id,
      Message AS message,
      Created_At AS createdAt
    FROM PChat
    WHERE Item_Id = @itemId;
  `;
  try {
    await connection.connect();
    const textProps = connection.request().input('itemId', itemId).query(itemTextPropsQuery);
    const numberProps = connection.request().input('itemId', itemId).query(itemNumberPropsQuery);
    const statusProps = connection.request().input('itemId', itemId).query(itemStatusPropsQuery);
    const timelineProps = connection.request().input('itemId', itemId).query(itemTimelinePropsQuery);
    const chats = connection.request().input('itemId', itemId).query(itemChatsQuery);

    const results = await Promise.all([textProps, numberProps, statusProps, timelineProps, chats]);

    return {
      itemId,
      textProps: results[0].recordset,
      numberProps: results[1].recordset,
      statusProps: results[2].recordset,
      timelineProps: results[3].recordset,
      chats: results[4].recordset
    };

  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
      ? error.message 
      : 'SQL Server error while fetching page properties';
    return new Error(errorMsg)
  }
}

export async function getTasksData(itemId: string): Promise<{totalTasks: number, completedTasks: number} | Error> {
  const query = `
  SELECT 
    COUNT(*) as TotalTasks,
    SUM(CAST(t.Is_Completed as INT)) as CompletedTasks
  FROM PTask t
  INNER JOIN PChat c ON t.PChat_Id = c.PChat_Id
  WHERE c.Item_Id = @itemId;
`;

try {
  await connection.connect();
  const result = await connection.request()
    .input('itemId', itemId)
    .query(query);
    
  return {
    totalTasks: result.recordset[0].TotalTasks || 0,
    completedTasks: result.recordset[0].CompletedTasks || 0
  };
} catch(error) {
  console.log(error);
  const errorMsg = (error instanceof Error && error.message)
    ? error.message
    : 'SQL Server error while fetching item task counts';
  return new Error(errorMsg);
}
}

export async function createItem(groupId: string, pageId: string, viewId: string): Promise<number | Error> {
  const query = `
    INSERT INTO Item (Group_Id, Title)
    VALUES (@groupId, @title);
  `;
  
  try {
    await connection.connect();
    const result = await connection.request()
      .input('groupId', groupId)
      .input('title', faker.lorem.word(10))
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];
  } catch(error) {
    console.log(error);
    const errorMsg = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while creating new item';
    return new Error(errorMsg);
  }
}

export async function updateGroupColor(groupId: string, color: string, pageId: string, viewId: string): Promise<number | Error> {
  const query = `
    UPDATE Grupo
    SET Color = @color
    WHERE Group_Id = @groupId;
  `;
  
  try {
    await connection.connect();
    const result = await connection.request()
      .input('groupId', groupId)
      .input('color', color)
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];
  } catch(error) {
    console.log(error);
    const errorMsg = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while updating group color';
    return new Error(errorMsg);
  }
}

export async function updateGroupTitle(groupId: string, title: string, pageId: string, viewId: string): Promise<number | Error> {
  const query = `
    UPDATE Grupo
    SET Title = @title
    WHERE Group_Id = @groupId;
  `;
  
  try {
    await connection.connect();
    const result = await connection.request()
      .input('groupId', groupId)
      .input('title', title)
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];
  } catch(error) {
    console.log(error);
    const errorMsg = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while updating group title';
    return new Error(errorMsg);
  }
}