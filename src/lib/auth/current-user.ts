import { cache } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const requireCurrentUser = cache(async function requireCurrentUser() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses[0]?.emailAddress ||
    '';

  return {
    id: user.id,
    email,
    name: user.fullName || user.username || email.split('@')[0],
  };
});
