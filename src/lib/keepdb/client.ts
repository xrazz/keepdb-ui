import { getKeepDbApiBase } from '@/lib/keepdb/config';
import { getOrCreateDashboardClientKey } from '@/lib/keepdb/dashboard-client-key';

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
  metadata?: Record<string, unknown> & {
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

async function keepDbFetch<T>(path: string): Promise<KeepDbResponse<T>> {
  try {
    const clientKey = await getOrCreateDashboardClientKey();
    const response = await fetch(`${getKeepDbApiBase()}${path}`, {
      headers: {
        Authorization: `Bearer ${clientKey}`,
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

export async function listKeepDbMemories(limit = 50, collection?: string) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (collection) params.set('collection', collection);
  return keepDbFetch<{ results: KeepDbMemory[] }>(`/memories?${params}`);
}

export async function searchKeepDbMemories(query: string, limit = 10) {
  const params = new URLSearchParams({ query, limit: String(limit) });
  return keepDbFetch<{ results: KeepDbMemory[]; retrieval?: unknown }>(`/memory?${params}`);
}

export async function timedSearchKeepDbMemories(query: string, limit = 10) {
  const startedAt = performance.now();
  const response = await searchKeepDbMemories(query, limit);

  return {
    response,
    elapsedMs: Math.round(performance.now() - startedAt),
  };
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
