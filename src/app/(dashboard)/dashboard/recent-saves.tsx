import Link from 'next/link';
import { formatKeepDbDate, previewMemory, type KeepDbMemory } from '@/lib/keepdb/client';

export function RecentSaves({ memories }: { memories: KeepDbMemory[] }) {
  if (memories.length === 0) {
    return <div className="px-4 py-5 text-sm text-zinc-500">No memories found.</div>;
  }

  return (
    <div className="divide-y divide-zinc-200">
      {memories.map((memory) => (
        <details key={memory.memoryId} className="group px-4 py-3">
          <summary className="grid cursor-pointer list-none gap-1 text-sm sm:grid-cols-[140px_1fr_120px] sm:items-center sm:gap-3">
            <Link
              href={`/search?q=${encodeURIComponent(memory.collection)}`}
              className="truncate text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {memory.collection}
            </Link>
            <span className="truncate text-zinc-800">{previewMemory(memory, 180)}</span>
            <span className="text-xs text-zinc-400 sm:text-right">{formatKeepDbDate(memory.createdAt)}</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:pl-[152px]">
            {previewMemory(memory, 1200)}
          </p>
        </details>
      ))}
    </div>
  );
}
