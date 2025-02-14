'use server';
import connection from '@/services/database';
import type { GroupData, ItemData, ItemDetail, PageProperties, PropertyData } from '@/utils/common/types';
import { faker } from '@faker-js/faker';
import { revalidatePath } from 'next/cache';
import type { DefinedProperty } from '@/utils/common/types';

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

    return await createItem(response.recordset[0].groupId, pageId, view_id);
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
  try {
    await connection.connect();

    const insertItemQuery = `
      INSERT INTO Item (Group_Id, Title)
      OUTPUT INSERTED.Item_Id
      VALUES (@groupId, @title);
    `;

    const itemResult = await connection.request()
      .input('groupId', groupId)
      .input('title', faker.lorem.word(10))
      .query(insertItemQuery);

    const newItemId = itemResult.recordset[0].Item_Id;

    const insertPropertiesQuery = `
      -- Insertamos propiedades de texto existentes
      INSERT INTO PText (Item_Id, Property_Title, Value)
      SELECT 
        @newItemId,
        pt.Property_Title,
        ''
      FROM PText pt
      INNER JOIN Item i ON pt.Item_Id = i.Item_Id
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      WHERE g.Page_Id = @pageId
      GROUP BY pt.Property_Title;

      -- Insertamos propiedades numéricas existentes  
      INSERT INTO PNumber (Item_Id, Property_Title, Value)
      SELECT 
        @newItemId,
        pn.Property_Title,
        0
      FROM PNumber pn
      INNER JOIN Item i ON pn.Item_Id = i.Item_Id
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      WHERE g.Page_Id = @pageId
      GROUP BY pn.Property_Title;

      -- Insertamos propiedades de estado existentes
      INSERT INTO PStatus (Item_Id, Property_Title, Value, Color)
      SELECT 
        @newItemId,
        ps.Property_Title,
        '',
        ps.Color
      FROM PStatus ps
      INNER JOIN Item i ON ps.Item_Id = i.Item_Id
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      WHERE g.Page_Id = @pageId
      GROUP BY ps.Property_Title, ps.Color;

      -- Insertamos propiedades timeline existentes
      INSERT INTO PTime_Line (Item_Id, Property_Title, Start_Date, End_Date)
      SELECT 
        @newItemId,
        pt.Property_Title,
        GETDATE(),
        DATEADD(day, 7, GETDATE())
      FROM PTime_Line pt
      INNER JOIN Item i ON pt.Item_Id = i.Item_Id
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      WHERE g.Page_Id = @pageId
      GROUP BY pt.Property_Title;
    `;

    await connection.request()
      .input('newItemId', newItemId)
      .input('pageId', pageId)
      .query(insertPropertiesQuery);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return 1;
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

export async function deleteGroup(groupId: string, pageId: string, viewId: string): Promise<number | Error> {
  const deleteGroupQuery: string = `
    DELETE FROM Grupo WHERE Group_Id = @groupId;
  `;
  try{
    await connection.connect();
    const result = await connection.request()
      .input('groupId', groupId)
      .query(deleteGroupQuery);
      revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];
  }catch(error){
    console.log(error);
    const errorMsg = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while deleting group';
    return new Error(errorMsg);
  }
}

export async function createGroupColumn(pageId: string, viewId: string, typeProperty: DefinedProperty): Promise<number | Error> {
  try {
    let tableName: string = '';
    let propertyTitle: string = '';
    let defaultValue: string | number;
    let color: string = '';

    switch(typeProperty){
      case 'Text':
        tableName = 'PText';
        propertyTitle = 'Columna de texto';
        defaultValue = '';
        break;
      case 'Number':
        tableName = 'PNumber';
        propertyTitle = 'Columna de número';
        defaultValue = 0;
        break;
      case 'Status': 
        tableName = 'PStatus';
        propertyTitle = 'Columna de estado';
        defaultValue = '';
        color = faker.color.rgb();
        break;
      case 'TimeLine':
        return await createTimelineProperty(pageId, viewId);
    }

    const query: string = `
      INSERT INTO ${tableName} (
        Item_Id,
        Property_Title,
        Value
        ${typeProperty === 'Status' ? ',Color' : ''}
      )
      SELECT 
        i.Item_Id,
        @propertyTitle,
        @defaultValue
        ${typeProperty === 'Status' ? ',@color' : ''}
      FROM Item i
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      INNER JOIN Page p ON g.Page_Id = p.Page_Id
      WHERE p.Page_Id = @pageId
    `;

    await connection.connect();
    const result = await connection.request()
      .input('pageId', pageId)
      .input('propertyTitle', propertyTitle)
      .input('defaultValue', defaultValue!)
      .input('color', color)
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];
  } catch (error) {
    console.log(error);
    const errorMsg = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while creating new column';
    return new Error(errorMsg);
  }
}

async function createTimelineProperty( pageId: string, viewId: string): Promise<number | Error> {
  try {
    const query = `
      INSERT INTO PTime_Line (
        Item_Id,
        Property_Title,
        Start_Date,
        End_Date
      )
      SELECT 
        i.Item_Id,
        @propertyTitle,
        GETDATE(),
        DATEADD(day, 7, GETDATE())
      FROM Item i
      INNER JOIN Grupo g ON i.Group_Id = g.Group_Id
      INNER JOIN Page p ON g.Page_Id = p.Page_Id
      WHERE p.Page_Id = @pageId;
    `;

    await connection.connect();
    const result = await connection.request()
      .input('pageId', pageId)
      .input('propertyTitle', 'Columna de tiempo')
      .query(query);

    revalidatePath(`/projects/${pageId}/${viewId}`);
    return result.rowsAffected[0];

  } catch(error) {
    console.error(error);
    return new Error('Error creating new timeline property');
  }
}

export async function countGroups(pageId: string): Promise<number | Error> {
  const query = `
    SELECT COUNT(*) as totalGroups FROM Grupo WHERE Page_Id = @pageId;
  `;

  try {
    await connection.connect();
    const result = await connection.request()
      .input('pageId', pageId)
      .query(query);

    return result.recordset[0].totalGroups;
  } catch(error) {
    console.error(error);
    return new Error('Error counting groups');
  }
}