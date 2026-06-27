'use client';

import { Download } from 'lucide-react';
import type { KeepDbMemory } from '@/lib/keepdb/client';

function formatResultDate(value?: string | null) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function previewResult(memory: KeepDbMemory, maxLength = 180) {
  const preview = memory.metadata?.preview || memory.matchedChunk || memory.content;
  return preview.length > maxLength ? `${preview.slice(0, maxLength).trim()}...` : preview;
}

function bodyTitle(memory: KeepDbMemory, maxLength = 88) {
  const firstLine = memory.content
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);
  const title = firstLine || memory.content.trim() || memory.collection;

  return title.length > maxLength ? `${title.slice(0, maxLength).trim()}...` : title;
}

function downloadMemory(memory: KeepDbMemory) {
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

export function SearchResults({ results }: { results: KeepDbMemory[] }) {
  if (results.length === 0) {
    return <div className="rounded-md bg-zinc-50 px-4 py-5 text-sm font-medium text-zinc-500">No matching memories found.</div>;
  }

  return (
    <div className="space-y-2">
      {results.map((memory) => {
        const title = bodyTitle(memory);

        return (
          <details key={memory.memoryId} className="group rounded-md bg-zinc-50 px-3 py-2">
            <summary className="cursor-pointer list-none">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium leading-snug text-blue-600 hover:text-blue-700">
                    {title}
                  </p>
                  <span className="hidden max-w-36 shrink-0 truncate text-xs font-medium text-emerald-700 sm:inline">
                    {memory.collection}
                  </span>
                  <span className="hidden shrink-0 text-xs font-medium text-zinc-300 sm:inline">·</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-400">
                    {formatResultDate(memory.createdAt)}
                  </span>
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-2 text-xs font-medium text-zinc-500 sm:hidden">
                  <span className="truncate text-emerald-700">{memory.collection}</span>
                  <span className="text-zinc-300">·</span>
                  <span className="shrink-0">{formatResultDate(memory.createdAt)}</span>
                </div>
                <p className="mt-1 truncate text-sm font-medium leading-relaxed text-zinc-700">
                  {previewResult(memory, 240)}
                </p>
              </div>
            </summary>

            <div className="mt-3 border-t border-zinc-100 pt-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="truncate text-xs font-medium text-zinc-400">{memory.memoryId}</p>
                <button
                  type="button"
                  onClick={() => downloadMemory(memory)}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <Download className="size-3.5" />
                  Download
                </button>
              </div>
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
                {memory.content}
              </pre>
            </div>
          </details>
        );
      })}
    </div>
  );
}
