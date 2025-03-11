import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definir la interfaz para la estructura esperada de la cookie user-info
interface UserInfo {
  id: string | number;
  username: string;
  role: string;
}

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth-session')?.value;
  const userInfoCookie = request.cookies.get('user-info')?.value;
 
  const isLoginPage = request.nextUrl.pathname === '/login';
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Función para verificar si la cookie user-info tiene la estructura correcta
  const isValidUserInfoStructure = (userInfoStr: string | undefined): boolean => {
    if (!userInfoStr) return false;
    
    try {
      const userInfo = JSON.parse(userInfoStr) as Partial<UserInfo>;
      return (
        typeof userInfo === 'object' &&
        userInfo !== null &&
        'id' in userInfo &&
        'username' in userInfo &&
        'role' in userInfo &&
        typeof userInfo.username === 'string' &&
        typeof userInfo.role === 'string'
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Función para crear una respuesta de redirección con cookies borradas
  const redirectToLoginWithClearedCookies = () => {
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Borrar las cookies relacionadas con la autenticación
    response.cookies.delete('auth-session');
    response.cookies.delete('user-info');
    
    return response;
  };

  // Si hay sesión activa pero la estructura de user-info no es válida
  if (sessionCookie && !isValidUserInfoStructure(userInfoCookie) && !isPublicRoute) {
    return redirectToLoginWithClearedCookies();
  }
 
  // Verificar si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!sessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
 
  // Si el usuario está autenticado y está intentando acceder a la página de login
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