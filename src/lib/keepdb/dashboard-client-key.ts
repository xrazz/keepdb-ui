import { cache } from 'react';
import { getKeepDbSql } from '@/lib/keepdb/database';
import { getOrCreateKeepDbUser } from '@/lib/keepdb/keep-user';
import {
  createApiKey,
  decryptApiKey,
  encryptApiKey,
  getKeyPrefix,
  hashApiKey,
} from '@/lib/keepdb/key-crypto';

export const getOrCreateDashboardClientKey = cache(async function getOrCreateDashboardClientKey() {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();

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
});
