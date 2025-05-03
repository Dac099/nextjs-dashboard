import 'server-only';
import { cache } from 'react';
import { getSession } from '@/actions/auth';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session || session.isLoggedIn === false) {
    redirect('/login');
  }

  return {
    userId: session.id,
    username: session.username,
    isLoggedIn: session.isLoggedIn,
    role: session.role
  };
});
