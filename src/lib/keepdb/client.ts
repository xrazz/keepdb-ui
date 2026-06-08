import { requireCurrentUser } from '@/lib/auth/current-user';

const DEFAULT_KEEPDB_API_BASE = 'https://keepdb-api-production.up.railway.app';

export type KeepDbMemory = {
  memoryId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  collection: string;
  type?: string;
  chunks?: number;
  contentBytes?: number;
  matchedChunk?: string;
  score?: number;
  metadata?: {
    preview?: string;
    title?: string | null;
    document?: unknown;
    sourceType?: string;
  };
};

export type KeepDbCollection = {
  id: string;
  name: string;
  description?: string | null;
  memories: number;
  contentBytes: number;
  createdAt: string;
  updatedAt: string;
  lastMemoryAt?: string | null;
};

type KeepDbResponse<T> =
  | { configured: true; success: true; data: T }
  | { configured: true; success: false; message: string }
  | { configured: false; success: false; message: string };

function getKeepDbConfig() {
  const internalSecret = process.env.KEEPDB_INTERNAL_SECRET;
  const apiBase = process.env.KEEPDB_API_BASE || DEFAULT_KEEPDB_API_BASE;
  return { apiBase: apiBase.replace(/\/$/, ''), internalSecret };
}

async function getClientApiKey() {
  const { apiBase, internalSecret } = getKeepDbConfig();
  const user = await requireCurrentUser();

  if (!internalSecret) {
    return {
      success: false as const,
      configured: false as const,
      message: 'KeepDB is not connected for this deployment yet.',
    };
  }

  if (!user.email) {
    return {
      success: false as const,
      configured: true as const,
      message: 'Signed-in user has no email address.',
    };
  }

  const response = await fetch(`${apiBase}/internal/client-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-KeepDB-Internal-Secret': internalSecret,
    },
    body: JSON.stringify({
      supabaseUserId: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split('@')[0],
    }),
    cache: 'no-store',
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success || !body?.apiKey?.rawKey) {
    return {
      success: false as const,
      configured: true as const,
      message: body?.message || `KeepDB connection failed with ${response.status}`,
    };
  }

  return {
    success: true as const,
    configured: true as const,
    apiKey: body.apiKey.rawKey as string,
  };
}

async function keepDbFetch<T>(path: string): Promise<KeepDbResponse<T>> {
  const { apiBase } = getKeepDbConfig();
  const clientKey = await getClientApiKey();

  if (!clientKey.success) {
    return {
      configured: clientKey.configured,
      success: false,
      message: clientKey.message,
    };
  }

  try {
    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        Authorization: `Bearer ${clientKey.apiKey}`,
      },
      cache: 'no-store',
    });
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
      return {
        configured: true,
        success: false,
        message: body?.message || `KeepDB request failed with ${response.status}`,
      };
    }

    return { configured: true, success: true, data: body as T };
  } catch (error) {
    return {
      configured: true,
      success: false,
      message: error instanceof Error ? error.message : 'Could not reach KeepDB API.',
    };
  }
}

export async function listKeepDbCollections() {
  return keepDbFetch<{ results: KeepDbCollection[] }>('/collections');
}

export async function listKeepDbMemories(limit = 50) {
  return keepDbFetch<{ results: KeepDbMemory[] }>(`/memories?limit=${limit}`);
}

export async function searchKeepDbMemories(query: string, limit = 10) {
  const params = new URLSearchParams({ query, limit: String(limit) });
  return keepDbFetch<{ results: KeepDbMemory[]; retrieval?: unknown }>(`/memory?${params}`);
}

export function formatKeepDbDate(value?: string | null) {
  if (!value) return 'No memories yet';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function previewMemory(memory: KeepDbMemory, maxLength = 180) {
  const preview = memory.metadata?.preview || memory.matchedChunk || memory.content;
  return preview.length > maxLength ? `${preview.slice(0, maxLength).trim()}...` : preview;
}
