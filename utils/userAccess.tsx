'use server';
import { ROLES } from './roleDefinition';
import { Role, Actions } from './types/roles';
import connection from '@/services/database';
import { getSession } from '@/actions/auth';

export async function getRoleAccess(): Promise<Role> {
  const session = await getSession();
  const role = session?.role;
  return ROLES[role];
}

export async function roleAccess(boardId: string): Promise<Actions[]> {
  await connection.connect();
  const query: string = `
    SELECT 
      w.name
    FROM Workspaces w
    LEFT JOIN Boards b on b.workspace_id = w.id
    WHERE b.id = @boardId
  `;
  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(query);

  const workspace = result.recordset[0] ? result.recordset[0].name : '';

  const role = await getRoleAccess();
  const permissions = role.permissions;
  const workspaceAccess = permissions.findIndex(permission => permission.workspace === workspace);


  if (workspaceAccess < 0) throw Error('Usuario sin permisos suficientes');

  return permissions[workspaceAccess].actions;
}
