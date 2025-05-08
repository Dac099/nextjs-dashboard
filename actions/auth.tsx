'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connection from '@/services/database';

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
  const cookieStore = await cookies();
  
  // Eliminar todas las cookies de sesión
  cookieStore.delete('userId');
  cookieStore.delete('username');
  cookieStore.delete('userRole');
  cookieStore.delete('isLoggedIn');
  
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

  try {
    userData = await getUserDataByCredentials(username, hashedPassword);
  } catch (e) {
    console.log(`Error on validate user credentials: ${e}`);
  }

  if (!userData) {
    redirect('/login?badCredentials=true');
  }

  // Usar cookies nativas de Next.js en lugar de iron-session
  const cookieStore = await cookies();
  
  // Crear cookies para cada dato de usuario necesario
  cookieStore.set('userId', userData.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // Una semana en segundos
    path: '/'
  });
  
  cookieStore.set('username', userData.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });
  
  cookieStore.set('userRole', userData.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });
  
  cookieStore.set('isLoggedIn', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });

  redirect('/');
}

/**
 * @description Get the session user data using Next.js native cookies
 * @returns An object with id: string, username: string, role: string, isLoggedIn: boolean
 */
export async function getSession() {
  const cookieStore = await cookies();
  
  const id = cookieStore.get('userId')?.value;
  const username = cookieStore.get('username')?.value;
  const role = cookieStore.get('userRole')?.value;
  const isLoggedInValue = cookieStore.get('isLoggedIn')?.value;
  const isLoggedIn = isLoggedInValue === 'true';
  
  // Si no hay cookie de sesión, devolvemos una sesión anónima
  if (!isLoggedIn) {
    return {
      id: 'none',
      username: 'Anonymous',
      role: 'none',
      isLoggedIn: false
    };
  }

  return {
    id: id || 'none',
    username: username || 'Anonymous',
    role: role || 'none',
    isLoggedIn: true
  };
}
