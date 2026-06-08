import { getKeepDbSql } from '@/lib/keepdb/database';
import { getOrCreateKeepDbUser } from '@/lib/keepdb/keep-user';
import { createApiKey, getKeyPrefix, hashApiKey } from '@/lib/keepdb/key-crypto';

const AGENT_KEY_SCOPES = ['memory:read', 'memory:write', 'memory:delete'];

export type AgentApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  createdAt: string;
};

type AgentKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[] | null;
  last_used_at: Date | string | null;
  created_at: Date | string;
};

function formatAgentKey(row: AgentKeyRow): AgentApiKey {
  return {
    id: row.id,
    name: row.name,
    keyPrefix: row.key_prefix,
    scopes: row.scopes || [],
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function listAgentApiKeys() {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();

  const rows = await db`
    SELECT id, name, key_prefix, scopes, last_used_at, created_at
    FROM api_keys
    WHERE user_id = ${keepUser.id}
      AND type = 'secret'
      AND revoked_at IS NULL
    ORDER BY created_at DESC
  `;

  return (rows as unknown as AgentKeyRow[]).map(formatAgentKey);
}

export async function createAgentApiKey(name: string) {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();
  const rawKey = createApiKey();
  const cleanName = name.trim() || 'Agent key';

  const [row] = await db`
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
      ${cleanName},
      ${getKeyPrefix(rawKey)},
      ${hashApiKey(rawKey)},
      NULL,
      'secret',
      ${AGENT_KEY_SCOPES}
    )
    RETURNING id, name, key_prefix, scopes, last_used_at, created_at
  `;

  return {
    key: formatAgentKey(row as unknown as AgentKeyRow),
    rawKey,
  };
}

export async function revokeAgentApiKey(id: string) {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();

  const [row] = await db`
    UPDATE api_keys
    SET revoked_at = NOW()
    WHERE id = ${id}
      AND user_id = ${keepUser.id}
      AND type = 'secret'
      AND revoked_at IS NULL
    RETURNING id
  `;

  return Boolean(row);
}
