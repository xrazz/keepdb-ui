const DEFAULT_KEEPDB_API_BASE = 'https://keepdb-api-production.up.railway.app';

export function getKeepDbApiBase() {
  return (process.env.KEEPDB_API_BASE || DEFAULT_KEEPDB_API_BASE).replace(/\/$/, '');
}

export function getKeepDbDatabaseUrl() {
  const url = process.env.KEEPDB_DATABASE_URL;
  if (!url) throw new Error('KEEPDB_DATABASE_URL is required');
  return url;
}

export function getKeepDbEncryptionSecret() {
  const secret = process.env.KEEPDB_KEY_ENCRYPTION_SECRET;
  if (!secret) throw new Error('KEEPDB_KEY_ENCRYPTION_SECRET is required');
  return secret;
}

export function getKeepDbWaitlistApiKey() {
  const apiKey = process.env.KEEPDB_WAITLIST_API_KEY || process.env.KEEPDB_API_KEY;
  if (!apiKey) throw new Error('KEEPDB_WAITLIST_API_KEY is required');
  return apiKey;
}
