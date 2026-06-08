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
  const dashboardSecret = process.env.KEEPDB_DASHBOARD_SECRET;
  const apiBase = process.env.KEEPDB_API_BASE || DEFAULT_KEEPDB_API_BASE;
  return { apiBase: apiBase.replace(/\/$/, ''), dashboardSecret };
}

async function keepDbFetch<T>(path: string): Promise<KeepDbResponse<T>> {
  const { apiBase, dashboardSecret } = getKeepDbConfig();

  if (!dashboardSecret) {
    return {
      configured: false,
      success: false,
      message: 'Add KEEPDB_DASHBOARD_SECRET to this deployment to load live KeepDB data.',
    };
  }

  try {
    const user = await requireCurrentUser();
    const email = user.email;

    if (!email) {
      return {
        configured: true,
        success: false,
        message: 'Signed-in user has no email address.',
      };
    }

    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        'X-KeepDB-Dashboard-Secret': dashboardSecret,
        'X-KeepDB-User-Email': email,
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
  return keepDbFetch<{ results: KeepDbCollection[] }>('/dashboard/collections');
}

export async function listKeepDbMemories(limit = 50) {
  return keepDbFetch<{ results: KeepDbMemory[] }>(`/dashboard/memories?limit=${limit}`);
}

export async function searchKeepDbMemories(query: string, limit = 10) {
  const params = new URLSearchParams({ query, limit: String(limit) });
  return keepDbFetch<{ results: KeepDbMemory[]; retrieval?: unknown }>(`/dashboard/search?${params}`);
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
