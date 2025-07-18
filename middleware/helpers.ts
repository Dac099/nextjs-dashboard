'use server'
import { type NextRequest, NextResponse } from 'next/server';

export async function validateAccessResources(req: NextRequest, res: NextResponse) {
  // Si la ruta es /login, permitimos el acceso sin verificar la sesión
  if(req.nextUrl.pathname === '/login') {
    // Verificar si el usuario ya tiene una sesión activa usando cookies nativas
    const isLoggedIn = req.cookies.get('isLoggedIn')?.value === 'true';
    
    // Si ya está autenticado, redirigimos a la página principal
    if(isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Si no está autenticado, permitimos el acceso a la página de login
    return res;
  }

  if(req.nextUrl.pathname.startsWith('/recursos')){
    const userRole = req.cookies.get('userRole')?.value;
    if(!userRole || !['SYSTEMS', 'PROJECTMANAGER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Para todas las demás rutas, verificamos la autenticación con cookies nativas
  const isLoggedIn = req.cookies.get('isLoggedIn')?.value === 'true';

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
