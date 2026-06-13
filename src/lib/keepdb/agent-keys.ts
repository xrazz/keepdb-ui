import { getKeepDbSql } from '@/lib/keepdb/database';
import { getOrCreateKeepDbUser } from '@/lib/keepdb/keep-user';
import { createApiKey, getKeyPrefix, hashApiKey } from '@/lib/keepdb/key-crypto';

export type AgentKeyAccess = 'read' | 'write' | 'read_write';

function scopesForAccess(access: AgentKeyAccess) {
  if (access === 'read') return ['memory:read'];
  if (access === 'write') return ['memory:write'];
  return ['memory:read', 'memory:write'];
}

export type AgentApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  collectionId: string | null;
  collectionName: string | null;
  lastUsedAt: string | null;
  createdAt: string;
};

type AgentKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[] | null;
  collection_id: string | null;
  collection_name: string | null;
  last_used_at: Date | string | null;
  created_at: Date | string;
};

function formatAgentKey(row: AgentKeyRow): AgentApiKey {
  return {
    id: row.id,
    name: row.name,
    keyPrefix: row.key_prefix,
    scopes: row.scopes || [],
    collectionId: row.collection_id || null,
    collectionName: row.collection_name || null,
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function listAgentApiKeys() {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();

  const rows = await db`
    SELECT
      k.id,
      k.name,
      k.key_prefix,
      k.scopes,
      k.collection_id,
      c.name AS collection_name,
      k.last_used_at,
      k.created_at
    FROM api_keys k
    LEFT JOIN collections c ON c.id = k.collection_id
    WHERE k.user_id = ${keepUser.id}
      AND k.type = 'secret'
      AND k.revoked_at IS NULL
    ORDER BY k.created_at DESC
  `;

  return (rows as unknown as AgentKeyRow[]).map(formatAgentKey);
}

type CreateAgentApiKeyInput = {
  name: string;
  access: AgentKeyAccess;
  collectionId?: string | null;
};

export async function createAgentApiKey({
  name,
  access,
  collectionId = null,
}: CreateAgentApiKeyInput) {
  const keepUser = await getOrCreateKeepDbUser();
  const db = getKeepDbSql();
  const rawKey = createApiKey();
  const cleanName = name.trim() || 'Agent key';
  const cleanCollectionId = collectionId?.trim() || null;
  const scopes = scopesForAccess(access);
  let collectionName: string | null = null;

  if (cleanCollectionId) {
    const rows = await db`
      SELECT id, name
      FROM collections
      WHERE id = ${cleanCollectionId}
        AND user_id = ${keepUser.id}
        AND deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) {
      throw new Error('Selected folder was not found.');
    }

    collectionName = rows[0].name;
  }

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
      ${cleanCollectionId},
      ${cleanName},
      ${getKeyPrefix(rawKey)},
      ${hashApiKey(rawKey)},
      NULL,
      'secret',
      ${scopes}
    )
    RETURNING id, name, key_prefix, scopes, collection_id, NULL::text AS collection_name, last_used_at, created_at
  `;

  return {
    key: {
      ...formatAgentKey(row as unknown as AgentKeyRow),
      collectionName,
    },
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
