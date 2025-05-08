'use server'
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/utils/types/roles';
import { NextRequest, NextResponse } from 'next/server';

export async function validateAccessResources(req: NextRequest, res: NextResponse) {
  // Si la ruta es /login, permitimos el acceso sin verificar la sesión
  if(req.nextUrl.pathname === '/login') {
    const session = await getIronSession<SessionData>(req, res, {
      password: 'hw57Bp7NGo39BvBvtYKT3r0fcJCy29Fn', // Required by iron-session to define the cookie
      cookieName: 'auth-session',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 // una semana en segundos
      }
    });
    
    // Si ya está autenticado, redirigimos a la página principal
    if(session.isLoggedIn){
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Si no está autenticado, permitimos el acceso a la página de login
    return res;
  }
  
  // Para todas las demás rutas, verificamos la autenticación
  const session = await getIronSession<SessionData>(req, res, {
    password: 'hw57Bp7NGo39BvBvtYKT3r0fcJCy29Fn',
    cookieName: 'auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60
    }
  });

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
