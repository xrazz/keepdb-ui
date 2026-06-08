import crypto from 'crypto';
import postgres from 'postgres';
import { requireCurrentUser } from '@/lib/auth/current-user';

const DEFAULT_STORAGE_LIMIT_BYTES = 104857600;

let sql: postgres.Sql | null = null;

function getSql() {
  const url = process.env.KEEPDB_DATABASE_URL;
  if (!url) throw new Error('KEEPDB_DATABASE_URL is required');

  sql ??= postgres(url, {
    prepare: false,
    ssl: 'require',
  });
  return sql;
}

function getEncryptionKey() {
  const secret = process.env.KEEPDB_KEY_ENCRYPTION_SECRET;
  if (!secret) throw new Error('KEEPDB_KEY_ENCRYPTION_SECRET is required');
  return crypto.createHash('sha256').update(secret).digest();
}

function createApiKey() {
  return `keep_sk_${crypto.randomBytes(32).toString('base64url')}`;
}

function hashApiKey(apiKey: string) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

function keyPrefix(apiKey: string) {
  return apiKey.slice(0, 18);
}

function encryptApiKey(apiKey: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((part) => part.toString('base64url')).join('.');
}

function decryptApiKey(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split('.');
  if (!ivValue || !tagValue || !encryptedValue) throw new Error('Invalid encrypted key');

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivValue, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export async function getOrCreateClientApiKey() {
  const user = await requireCurrentUser();
  if (!user.email) throw new Error('Signed-in user has no email address.');

  const db = getSql();
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
      ${keyPrefix(rawKey)},
      ${hashApiKey(rawKey)},
      ${encryptApiKey(rawKey)},
      'client',
      ARRAY['memory:read', 'memory:write', 'memory:delete']
    )
  `;

  return rawKey;
}
