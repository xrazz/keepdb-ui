import { cache } from 'react';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { getKeepDbSql } from '@/lib/keepdb/database';

const DEFAULT_STORAGE_LIMIT_BYTES = 104857600;

export const getOrCreateKeepDbUser = cache(async function getOrCreateKeepDbUser() {
  const user = await requireCurrentUser();
  if (!user.email) throw new Error('Signed-in user has no email address.');

  const db = getKeepDbSql();
  const email = user.email.trim().toLowerCase();
  const name = user.name || email.split('@')[0];

  const [keepUser] = await db`
    INSERT INTO users (
      supabase_user_id,
      email,
      name,
      plan,
      status,
      storage_limit_bytes
    )
    VALUES (
      ${user.id},
      ${email},
      ${name},
      'free',
      'active',
      ${DEFAULT_STORAGE_LIMIT_BYTES}
    )
    ON CONFLICT (email)
    DO UPDATE SET
      supabase_user_id = COALESCE(users.supabase_user_id, EXCLUDED.supabase_user_id),
      name = COALESCE(EXCLUDED.name, users.name),
      updated_at = NOW(),
      deleted_at = NULL
    RETURNING id, email, name, plan, status, storage_used_bytes, storage_limit_bytes
  `;

  return keepUser as {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    status: string;
    storage_used_bytes: number;
    storage_limit_bytes: number;
  };
});
