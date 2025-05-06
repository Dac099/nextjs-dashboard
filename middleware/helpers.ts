'use server'
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/utils/types/roles';
import { NextRequest, NextResponse } from 'next/server';

export async function validateAccessResources(req: NextRequest, res: NextResponse) {
  const session = await getIronSession<SessionData>(req, res, {
    password: 'hw57Bp7NGo39BvBvtYKT3r0fcJCy29Fn', // Required by iron-session to define the cookie
    cookieName: 'auth-session',
    ttl: 0
  });

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
