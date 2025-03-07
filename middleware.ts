import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth-session')?.value;
  
  const isLoginPage = request.nextUrl.pathname === '/login';
  
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  
  if (!sessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    
    // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  if (sessionCookie && isLoginPage) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Aplicar a todas las rutas excepto a archivos estáticos, API, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};