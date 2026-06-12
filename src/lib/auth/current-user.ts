import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getAppSessionUser } from '@/lib/auth/app-session';

export const requireCurrentUser = cache(async function requireCurrentUser() {
  const user = await getAppSessionUser();

  if (!user) {
    redirect('/login?error=Your session expired. Please sign in again.');
  }

  return user;
});
