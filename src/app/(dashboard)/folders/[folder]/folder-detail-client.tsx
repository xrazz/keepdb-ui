'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MemoryRows } from '../../memories/memory-rows';
import type { KeepDbMemory } from '@/lib/keepdb/client';

type FolderDetailClientProps = {
  folder: string;
  memories: KeepDbMemory[];
};

function readableName(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function FolderDetailClient({ folder, memories }: FolderDetailClientProps) {
  const [query, setQuery] = useState('');
  const visibleMemories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return memories;

    return memories.filter((memory) => {
      const preview = typeof memory.metadata?.preview === 'string' ? memory.metadata.preview : '';
      return [memory.memoryId, memory.content, memory.matchedChunk || '', preview]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [memories, query]);

  return (
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true">📁</span>
          <h1 className="truncate text-sm font-medium text-blue-700">{readableName(folder)}</h1>
          <span className="shrink-0 text-xs font-medium text-zinc-500">
            {visibleMemories.length.toLocaleString()} {visibleMemories.length === 1 ? 'memory' : 'memories'}
          </span>
        </div>
        <label className="flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:max-w-xs">
          <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search memories"
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
        </label>
      </div>

      <MemoryRows memories={visibleMemories} showCollection={false} />
    </div>
  );
}
