'use server';
import connection from '@/services/database';
import { revalidatePath } from 'next/cache';

export async function getAllUsers(){
  await connection.connect();
  const query: string = `
    SELECT
      id_user AS id, 
      nom_user AS name,
      usuario as username,
      monday_access as role
    FROM tb_user;
  `;

  const result = await connection.query(query);

  return result.recordset;
}

export async function setUserPermission(permission: string, userId: number){
  await connection.connect();
  const query: string = `
    UPDATE tb_user
    SET monday_access = @permission
    WHERE id_user = @userId
  `;

  await connection
    .request()
    .input('permission', permission)
    .input('userId', userId)
    .query(query);

  revalidatePath('/access');
}