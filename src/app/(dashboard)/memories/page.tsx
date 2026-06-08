import { formatKeepDbDate, listKeepDbMemories, previewMemory } from '@/lib/keepdb/client';

export default async function MemoriesPage() {
  const response = await listKeepDbMemories(50);
  const memories = response.success ? response.data.results : [];

  return (
    <div className="w-full pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-[180px_1fr_140px] border-b border-zinc-200 px-4 py-3 text-xs font-medium text-zinc-500">
          <span>Database</span>
          <span>Memory</span>
          <span>Created</span>
        </div>
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div key={memory.memoryId} className="grid grid-cols-[180px_1fr_140px] px-4 py-4 text-sm">
              <span className="font-medium text-zinc-950">{memory.collection}</span>
              <span className="text-zinc-600">{previewMemory(memory)}</span>
              <span className="text-zinc-400">{formatKeepDbDate(memory.createdAt)}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-sm text-zinc-500">No memories found.</div>
        )}
      </div>
    </div>
  );
}
