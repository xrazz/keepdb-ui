'use client';

import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

type MemoryRow = {
  memoryId: string;
  content: string;
  createdAt: string;
  collection: string;
  matchedChunk?: string;
  metadata?: {
    preview?: string;
  };
};

function formatMemoryDate(value?: string | null) {
  if (!value) return 'No memories yet';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function memoryPreview(memory: MemoryRow, maxLength = 180) {
  const preview = memory.metadata?.preview || memory.matchedChunk || memory.content;
  return preview.length > maxLength ? `${preview.slice(0, maxLength).trim()}...` : preview;
}

function downloadMemory(memory: MemoryRow) {
  const blob = new Blob([memory.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${memory.collection}-${memory.memoryId}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function MemoryRows({ memories, showCollection = true }: { memories: MemoryRow[]; showCollection?: boolean }) {
  const [rows, setRows] = useState(memories);
  const [deletingId, setDeletingId] = useState('');
  const [message, setMessage] = useState('');

  async function deleteMemory(memory: MemoryRow) {
    const confirmed = window.confirm('Delete this memory?');
    if (!confirmed) return;

    setDeletingId(memory.memoryId);
    setMessage('');
    const response = await fetch(`/api/keepdb/memories/${memory.memoryId}`, { method: 'DELETE' });
    const body = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;

    if (response.ok && body?.success) {
      setRows((current) => current.filter((row) => row.memoryId !== memory.memoryId));
    } else {
      setMessage(body?.message || 'Could not delete memory.');
    }
    setDeletingId('');
  }

  if (rows.length === 0) {
    return <div className="flex min-h-40 items-center justify-center text-center text-sm font-medium text-zinc-500">No memories found.</div>;
  }

  return (
    <div className="space-y-2">
      {message && (
        <div className="rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {message}
        </div>
      )}
      <div className="space-y-2">
        {rows.map((memory) => (
          <details key={memory.memoryId} className="group rounded-md bg-zinc-50 px-3 py-2">
            <summary className={`grid cursor-pointer list-none gap-1 text-sm sm:items-center sm:gap-3 ${
              showCollection ? 'sm:grid-cols-[140px_1fr_120px]' : 'sm:grid-cols-[1fr_120px]'
            }`}>
              {showCollection && (
                <span className="min-w-0 truncate font-medium text-blue-600">
                  {memory.collection}
                </span>
              )}
              <span className="min-w-0 truncate font-medium text-zinc-700">{memoryPreview(memory)}</span>
              <span className="text-xs font-medium text-zinc-400 sm:text-right">{formatMemoryDate(memory.createdAt)}</span>
            </summary>

            <div className="mt-3 border-t border-zinc-100 pt-3">
              <div>
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="truncate text-xs font-medium text-zinc-400">{memory.memoryId}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadMemory(memory)}
                      className="inline-flex h-8 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                    >
                      <Download className="size-3.5" />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteMemory(memory)}
                      disabled={deletingId === memory.memoryId}
                      className="inline-flex h-8 items-center gap-2 rounded-full bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" />
                      {deletingId === memory.memoryId ? 'Deleting' : 'Delete'}
                    </button>
                  </div>
                </div>
                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
                  {memory.content}
                </pre>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
