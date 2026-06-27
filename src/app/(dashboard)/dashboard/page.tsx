import {
  formatKeepDbDate,
  listKeepDbCollections,
  listKeepDbMemories,
} from '@/lib/keepdb/client';
import { RecentSaves } from './recent-saves';

function responseMessage(response: { success: boolean; message?: string }) {
  return response.success ? null : response.message || null;
}

export default async function DashboardPage() {
  const collectionsResponse = await listKeepDbCollections();
  const memoriesResponse = await listKeepDbMemories(15);

  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = memoriesResponse.success ? memoriesResponse.data.results : [];
  const totalMemories = collections.reduce((sum, collection) => sum + collection.memories, 0);
  const latestMemory = memories[0];
  const stats = [
    { label: 'Saved memories', value: totalMemories.toLocaleString() },
    { label: 'Memory spaces', value: collections.length.toLocaleString() },
    { label: 'Latest save', value: latestMemory ? formatKeepDbDate(latestMemory.createdAt) : 'None yet' },
  ];
  const configMessage =
    responseMessage(collectionsResponse) ||
    responseMessage(memoriesResponse);

  return (
    <div className="w-full max-w-3xl pb-12">
      {configMessage && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configMessage}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">Recent saves</h2>
        <RecentSaves memories={memories} />
      </div>
    </div>
  );
}
