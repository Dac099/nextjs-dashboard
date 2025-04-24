'use server';
import connection from '@/services/database';
import { revalidatePath } from 'next/cache';
import type { Workspace, WorkspaceWithDashboards } from '@/utils/types/dashboard';
import { cookies } from 'next/headers';
import { ROLES } from '@/utils/roleDefinition';

export async function addNewWorkspace(name: string) {
  const query: string = `
    INSERT INTO Workspaces (name)
    VALUES (@name)
  `;
  try{
    await connection.connect();
    const results = await connection
      .request()
      .input('name', name)
      .query(query);
    
    revalidatePath('/');
    return results.recordset;
  }catch(error){
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
      ? error.message 
      : 'SQL Server error while insert new dashboard workspace';
    return new Error(errorMsg)
  }
}

export async function getAllWorkspace(): Promise<WorkspaceWithDashboards | Error> {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user-info');
  
  const userInfo = JSON.parse(userInfoCookie!.value);
  const userPermissions = ROLES[userInfo.role].permissions;
  
  const query: string = `
    SELECT
      w.id,
      w.name,
      b.id AS boardId,
      b.name AS boardName
    FROM Workspaces w
    LEFT JOIN Boards b ON b.workspace_id = w.id
    WHERE b.deleted_at IS NULL
    ORDER BY b.created_at
  `;
  
  try {
    await connection.connect();
    const results = (await connection.query(query));
    
    const filteredResults = results.recordset.reduce((acc: WorkspaceWithDashboards, record: Workspace) => {
      const permission = userPermissions.filter(permission => permission.workspace === record.name);

      if(permission.length > 0){
        if (!acc[record.id]) {
          acc[record.id] = [];
        }
        
        if(permission[0].boards.includes(record.boardName) || permission[0].boards[0] === '*'){
          acc[record.id].push({
            workspaceId: record.id,
            workspaceName: record.name,
            boardId: record.boardId,
            boardName: record.boardName
          });
        }
      }

      return acc;
    }, {});
    
    return filteredResults;
  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message)
      ? error.message
      : 'SQL Server error while get all dashboard workspace';
    return new Error(errorMsg);
  }
}

export async function updateWorkspace(id: string, onDelete: boolean = false, newName: string = ''){
  const deleteQuery: string = `
    UPDATE Workspaces
    SET deleted_at = GETDATE()
    WHERE id = @id
  `;
  const updateQuery: string = `
    UPDATE Workspaces
    SET name = @name
    WHERE id = @id
  `;
  try {
    await connection.connect();
    let results = null;
    
    if(onDelete){
      results = await connection
        .request()
        .input('id', id)
        .query(deleteQuery);
      return results.recordset;
    }
    
    results = await connection
      .request()
      .input('id', id)
      .input('name', newName)
      .query(updateQuery);
    
    revalidatePath('/');
    return results.recordset;
  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
      ? error.message 
      : 'SQL Server error while delete dashboard workspace';
    return new Error(errorMsg)
  }
}

export async function addDashboard(name: string, workspaceId: string): Promise<string>
{
  const query: string = `
    INSERT INTO Boards (workspace_id, name)
    OUTPUT inserted.id
    VALUES (@workspaceId, @name);
  `;
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('workspaceId', workspaceId)
      .input('name', name)
      .query(query);
    
    const boardId: string = result.recordset[0].id;
    revalidatePath('/');
    return boardId;

  } catch (error) {
    console.log(error);
    const errorMsg: string = (error instanceof Error && error.message) 
    ? error.message 
    : 'SQL Server error while delete dashboard workspace';
    throw new Error(errorMsg)
  }
}

export async function getBoardItemsGrouped(boardId: string) {
  try {
    await connection.connect();
    
    const spNameForSubItemsData = 'GetSubItemsWithPivotedColumns';
    const spNameForItemsData = 'GetItemsWithPivotedColumns';
    
    // Ejecutar los SPs para obtener datos
    const itemsPromise = connection
      .request()
      .input('BoardId', boardId)
      .execute(spNameForItemsData);
      
    const subItemsPromise = connection
      .request()
      .input('BoardId', boardId)
      .execute(spNameForSubItemsData);
    
    // Esperar a que ambas consultas se completen
    const [itemsData, subItemsData] = await Promise.all([itemsPromise, subItemsPromise]);
    
    // Procesar y agrupar los datos
    const groupedData: Map<string, any[]> = new Map();
    
    itemsData.recordset.forEach((item: any) => {
      const groupName = item.groupName ?? 'Sin grupo';
      
      if(!groupedData.has(groupName)){
        groupedData.set(groupName, []);
      }
      
      const ownedSubItems = subItemsData.recordset.filter(
        (subItem: any) => subItem.parentId === item.itemId
      );
      
      groupedData.get(groupName)!.push({
        ...item,
        subItems: ownedSubItems
      });
    });
    
    // Cerrar la conexión
    await connection.close();
    
    return groupedData;
  } catch (error) {
    // Asegurarse de cerrar la conexión en caso de error
    try {
      await connection.close();
    } catch (closeError) {
      console.error("Error al cerrar la conexión:", closeError);
    }
    
    console.error("Error al obtener los datos del tablero:", error);
    throw error;
  }
}