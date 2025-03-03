import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenemos el token de la sesión desde las cookies
  const sessionCookie = request.cookies.get('auth-session')?.value;
  
  // Verificamos si el usuario está accediendo a la página de login
  const isLoginPage = request.nextUrl.pathname === '/login';
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  
  // Si no hay sesión y NO es una ruta pública, redirigir a login
  if (!sessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    
    // Opcional: Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Si hay sesión y está en login, redirigir a la página principal
  if (sessionCookie && isLoginPage) {
    // Verificar si hay una URL de callback
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // En otros casos, permitimos el acceso
  return NextResponse.next();
}

// Configuramos en qué rutas se aplica el middleware
export const config = {
  // Aplicar a todas las rutas excepto a archivos estáticos, API, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};