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
  try {
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

    const workspace = result.recordset[0]?.name;

    if(!workspace) throw Error('Ocurrió un error al obtener la información del workspace');

    const role = await getRoleAccess();
    
    if (!role) throw Error('No se ha encontrado el rol del usuario');
    console.log('ROL del usuario:', role);

    const permissions = role.permissions;
    const workspaceAccess = permissions.findIndex(permission => permission.workspace === workspace);



    return permissions[workspaceAccess].actions;
  } catch (error) {
    console.error('Error al obtener los permisos del usuario:', error);
    throw error;
  }
}
