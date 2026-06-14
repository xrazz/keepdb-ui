'use client';

import { ChevronDown, Download } from 'lucide-react';

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

export function MemoryRows({ memories }: { memories: MemoryRow[] }) {
  if (memories.length === 0) {
    return <div className="px-4 py-5 text-sm text-zinc-500">No memories found.</div>;
  }

  return (
    <div className="divide-y divide-zinc-200">
      {memories.map((memory) => (
        <details key={memory.memoryId} className="group">
          <summary className="grid cursor-pointer list-none grid-cols-[180px_1fr_140px] items-center px-4 py-4 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium text-zinc-950">
              <ChevronDown className="size-3 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
              <span className="truncate text-blue-700">{memory.collection}</span>
            </span>
            <span className="truncate text-zinc-600">{memoryPreview(memory)}</span>
            <span className="text-zinc-400">{formatMemoryDate(memory.createdAt)}</span>
          </summary>

          <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-4">
            <div className="ml-[24px] max-w-4xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-xs text-zinc-400">{memory.memoryId}</p>
                <button
                  type="button"
                  onClick={() => downloadMemory(memory)}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <Download className="size-3.5" />
                  Download
                </button>
              </div>
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-4 font-mono text-xs leading-relaxed text-zinc-700">
                {memory.content}
              </pre>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
