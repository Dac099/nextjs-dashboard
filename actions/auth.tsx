'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connection from '@/services/database';
import { createHash, randomBytes } from 'crypto';

type LoginResult = {
  success?: boolean;
  error?: string;
}

type UserData = {
  id: string;
  username: string;
  password: string;
  role: string
};

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const cookieStore = await cookies();
  let userInDB: UserData | null;

  if (!username || !password) {
    return { error: 'Nombre de usuario y contraseña obligatorios' };
  }

  try {
    userInDB = await credentialsInDB(username, hashPassword(password));

    if (!userInDB) {
      return { error: 'Credenciales incorrectas' };
    }

  } catch (error) {
    console.log(error);
    return { error: 'Error del servidor. Inténtalo más tarde.' };
  }

  const sessionId = randomBytes(16).toString('hex');

  cookieStore.set('auth-session', sessionId, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
    sameSite: 'strict'
  });

  cookieStore.set('user-info', JSON.stringify({
    id: userInDB.id,
    username: userInDB.username,
    role: userInDB.role
  }), {
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/');
}

function hashPassword(password: string): string {
  return createHash('sha1').update(password).digest('hex').toUpperCase();
}

async function credentialsInDB(username: string, password: string): Promise<UserData | null> {
  try {
    await connection.connect();
    const query: string = `
      SELECT 
        id_user as id,
        usuario as username,
        passwd_user as password,
        monday_access as role
      from tb_user
      where usuario = @username AND passwd_user = @password;
    `;

    const result = await connection
      .request()
      .input('username', username)
      .input('password', password)
      .query(query);

    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete('auth-session');
  cookieStore.delete('user-info');

  redirect('/login');
}

export async function getWorkspaceWithBoard(boardId: string) {
  await connection.connect();
  const query: string = `
    SELECT
      w.name AS workspaceName,
      b.name AS boardName
    FROM Boards b
    LEFT JOIN Workspaces w on b.workspace_id = w.id
    WHERE b.id = @boardId
  `;
  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(query);

  return result.recordset[0];
}

export async function getUserInfo(): Promise<{id: string; name: string;}> {
  const userData = {
    id: '',
    name: '',
  };

  try {
    const cookieStore = await cookies();
    const userInfo = cookieStore.get('user-info');

    if (!userInfo) {
      throw new Error("Error on get user info cookies");
    }

    const parsedInfo = JSON.parse(userInfo.value);

    userData.id = parsedInfo.id;

    await connection.connect();

    const query: string = `
      SELECT nom_user AS username
      FROM tb_user
      WHERE id_user = @idUser
    `;

    const result = await connection 
      .request()
      .input('idUser', parsedInfo.id)
      .query(query);

    userData.name = result.recordset[0].username;
  } catch {
    throw new Error('Ocurrió un error al obtener la información del usuario');
  }

  return userData;
}
