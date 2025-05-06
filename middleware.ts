import { NextRequest, NextResponse } from 'next/server';
import { validateAccessResources } from './middleware/helpers';

export async function middleware(request: NextRequest) {
  validateAccessResources(request, NextResponse.next());

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}
