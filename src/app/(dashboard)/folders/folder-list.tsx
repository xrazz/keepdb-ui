'use client';

import { ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { KeepDbCollection } from '@/lib/keepdb/client';

type SortMode = 'updated' | 'created' | 'name' | 'memories';

function sortCollections(collections: KeepDbCollection[], sortMode: SortMode) {
  return [...collections].sort((a, b) => {
    if (sortMode === 'name') return a.name.localeCompare(b.name);
    if (sortMode === 'memories') return b.memories - a.memories;
    if (sortMode === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    const aTime = new Date(a.lastMemoryAt || a.updatedAt || a.createdAt).getTime();
    const bTime = new Date(b.lastMemoryAt || b.updatedAt || b.createdAt).getTime();
    return bTime - aTime;
  });
}

export function FolderList({ collections }: { collections: KeepDbCollection[] }) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('updated');

  const visibleCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? collections.filter((collection) => collection.name.toLowerCase().includes(normalizedQuery))
      : collections;

    return sortCollections(filtered, sortMode);
  }, [collections, query, sortMode]);

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:max-w-sm">
          <Search className="mr-2 size-3.5 text-blue-600" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search folder name"
            className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          />
        </label>

        <div className="relative sm:w-44">
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-9 w-full appearance-none rounded-full border border-zinc-200/70 bg-zinc-50 pl-3 pr-10 text-xs font-medium text-zinc-600 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] outline-none focus:border-zinc-300"
          >
            <option value="updated">Recently changed</option>
            <option value="created">Recently created</option>
            <option value="memories">Most memories</option>
            <option value="name">Name</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div>
        <div className="space-y-2">
          {visibleCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/folders/${encodeURIComponent(collection.name)}`}
              className="flex items-center justify-between gap-4 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100/70"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true">📁</span>
                <span className="truncate text-blue-700">{collection.name}</span>
              </span>
              <span className="shrink-0 text-zinc-500">
                {collection.memories.toLocaleString()} {collection.memories === 1 ? 'memory' : 'memories'}
              </span>
            </Link>
          ))}

          {visibleCollections.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-zinc-400">
              <Search className="size-4" strokeWidth={1.8} />
              <p className="text-sm font-medium text-zinc-500">No folders match this search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
