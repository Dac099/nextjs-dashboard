'use server';
import connection from '@/services/database';
import { revalidatePath } from 'next/cache';
import type { Workspace, WorkspaceWithDashboards } from '@/utils/types/dashboard';
import { cookies } from 'next/headers';

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
  // Obtener información del usuario desde la cookie
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user-info');
  
  const userInfo = JSON.parse(userInfoCookie!.value);
  
  const allowedWorkspaces = userInfo.access.read.workspaces;
  const allowedBoards = userInfo.access.read.boards;
  
  if (allowedWorkspaces.length === 0 && allowedBoards.length === 0) {
    return {};
  }
  
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

      const hasWorkspaceAccess = allowedWorkspaces.includes(record.name);
      const hasBoardAccess = allowedBoards.includes(record.boardName);
      
      if (hasWorkspaceAccess && hasBoardAccess) {
        if (!acc[record.id]) {
          acc[record.id] = [];
        }
        
        acc[record.id].push({
          workspaceId: record.id,
          workspaceName: record.name,
          boardId: record.boardId,
          boardName: record.boardName
        });
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