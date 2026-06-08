import { requireCurrentUser } from '@/lib/auth/current-user';
import { getKeepDbSql } from '@/lib/keepdb/database';
import {
  createApiKey,
  decryptApiKey,
  encryptApiKey,
  getKeyPrefix,
  hashApiKey,
} from '@/lib/keepdb/key-crypto';

const DEFAULT_STORAGE_LIMIT_BYTES = 104857600;

export async function getOrCreateDashboardClientKey() {
  const user = await requireCurrentUser();
  if (!user.email) throw new Error('Signed-in user has no email address.');

  const db = getKeepDbSql();
  const email = user.email.trim().toLowerCase();
  const name =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : email.split('@')[0];

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
    RETURNING id
  `;

  const existingKeys = await db`
    SELECT encrypted_key
    FROM api_keys
    WHERE user_id = ${keepUser.id}
      AND type = 'client'
      AND revoked_at IS NULL
      AND encrypted_key IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (existingKeys[0]?.encrypted_key) {
    return decryptApiKey(existingKeys[0].encrypted_key);
  }

  const rawKey = createApiKey();
  await db`
    INSERT INTO api_keys (
      user_id,
      collection_id,
      name,
      key_prefix,
      key_hash,
      encrypted_key,
      type,
      scopes
    )
    VALUES (
      ${keepUser.id},
      NULL,
      'Dashboard client key',
      ${getKeyPrefix(rawKey)},
      ${hashApiKey(rawKey)},
      ${encryptApiKey(rawKey)},
      'client',
      ARRAY['memory:read', 'memory:write', 'memory:delete']
    )
  `;

  return rawKey;
}
