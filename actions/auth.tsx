'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connection from '@/services/database';
import { getIronSession, IronSession } from 'iron-session';

type UserData = {
  id: string;
  username: string;
  password: string;
  role: string
};

/**
 * 
 * @param password String password to hash
 * @description Hashes the password using SHA-1 algorithm
 * @returns The hashed password in hexadecimal format
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

async function getUserDataByCredentials(username: string, password: string): Promise<UserData | null> {
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
  const session = await getSession();
  session.destroy();
  redirect('/login');
}

export async function getUserInfo(): Promise<{ id: string; name: string; }> {
  const userData = {
    id: '',
    name: '',
  };

  try {
    const session = await getSession();
    userData.id = session.id;
    userData.name = session.username;
  } catch {
    throw new Error('Ocurrió un error al obtener la información del usuario');
  }

  return userData;
}

export async function loginUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const hashedPassword = await hashPassword(password);
  let userData: UserData | null = null;
  let userSession: IronSession<{
    id: string;
    username: string;
    role: string,
    isLoggedIn: boolean
  }> | null = null;

  try {
    userData = await getUserDataByCredentials(username, hashedPassword);
  } catch (e) {
    console.log(`Error on validate user credentials: ${e}`);
  }

  if (!userData) {
    redirect('/login?badCredentials=true');
  }

  try {
    userSession = await getSession();
  } catch (e) {
    console.log(`Error on get session: ${e}`);
  }

  if (!userSession) {
    redirect('/login?error=Error al validar credenciales');
  }

  userSession.id = userData.id;
  userSession.username = userData.username;
  userSession.role = userData.role;
  userSession.isLoggedIn = true;
  await userSession.save();

  redirect('/');
}

/**
 * @description Get the session user data
 * @returns An object with id: string, username: string, role: string, isLoggedIn: boolean
 */
export async function getSession() {
  const session = await getIronSession<{ id: string; username: string; role: string, isLoggedIn: boolean }>(await cookies(), {
    password: 'hw57Bp7NGo39BvBvtYKT3r0fcJCy29Fn', // Required by iron-session to define the cookie
    cookieName: 'auth-session',
    ttl: 0
  });

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
    session.username = 'Anonymous';
    session.role = 'none';
    session.id = 'none';
  }

  return session;
}
