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
  access: {
    read: {
      workspaces: string[],
      boards: string[],
      views: string[],
    },
    edit: {
      workspaces: string[],
      boards: string[],
      views: string[],
    }
  }
};

export async function loginAction(formData: FormData): Promise<LoginResult>
{
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const cookieStore = await cookies();
  let userInDB: UserData | null;

  if(!username || !password)
  {
    return {error: 'Nombre de usuario y contraseña obligatorios'};
  }

  try {
    userInDB = await credentialsInDB(username, hashPassword(password));

    if(!userInDB)
    {
      return {error: 'Credenciales incorrectas'};
    }
    
  } catch (error) {
    console.log(error);
    return {error: 'Error del servidor. Inténtalo más tarde.'};
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
    access: userInDB.access
  }), {
    httpOnly: false, 
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  
  redirect('/');
}

function hashPassword(password: string): string
{
  return createHash('sha1').update(password).digest('hex').toUpperCase();
}

async function credentialsInDB(username: string, password: string): Promise<UserData | null>
{
  try {
    await connection.connect();
    const query: string = `
      SELECT 
        id_user as id,
        usuario as username,
        passwd_user as password,
        monday_access as access
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
    
    return {
      id: result.recordset[0].id,
      username: result.recordset[0].username,
      password: result.recordset[0].password,
      access: JSON.parse(result.recordset[0].access)
    };
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}