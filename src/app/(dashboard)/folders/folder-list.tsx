'use client';

import { Search } from 'lucide-react';
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
        <label className="flex h-10 w-full items-center rounded-md border border-zinc-200 bg-white px-3 sm:max-w-sm">
          <Search className="mr-2 size-4 text-zinc-400" strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search folder name"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
          />
        </label>

        <select
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as SortMode)}
          className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 outline-none"
        >
          <option value="updated">Recently changed</option>
          <option value="created">Recently created</option>
          <option value="memories">Most memories</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-500">
          Folders
        </div>
        <div className="divide-y divide-zinc-100">
          {visibleCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/folders/${encodeURIComponent(collection.name)}`}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-medium hover:bg-zinc-50"
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
            <div className="px-4 py-5 text-sm font-medium text-zinc-500">No folders match this search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
