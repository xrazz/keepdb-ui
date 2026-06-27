import { requireCurrentUser } from '@/lib/auth/current-user';
import { listAgentApiKeys } from '@/lib/keepdb/agent-keys';
import { listKeepDbCollections } from '@/lib/keepdb/client';
import { getOrCreateKeepDbUser } from '@/lib/keepdb/keep-user';

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const [keepUser, collectionsResponse, keys] = await Promise.all([
    getOrCreateKeepDbUser(),
    listKeepDbCollections(),
    listAgentApiKeys(),
  ]);
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const totalMemories = collections.reduce((sum, collection) => sum + collection.memories, 0);
  const storageUsed =
    Number(keepUser.storage_used_bytes) ||
    collections.reduce((sum, collection) => sum + collection.contentBytes, 0);
  const storageLimit = Number(keepUser.storage_limit_bytes) || 0;
  const stats = [
    { label: 'Plan', value: keepUser.plan || 'free' },
    { label: 'Storage', value: `${formatBytes(storageUsed)} / ${formatBytes(storageLimit)}` },
    { label: 'Folders', value: collections.length.toLocaleString() },
    { label: 'Memories', value: totalMemories.toLocaleString() },
    { label: 'API keys', value: keys.length.toLocaleString() },
  ];

  return (
    <div className="w-full max-w-3xl space-y-6 pb-12">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">Account</h2>
        <div className="rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-600">
          <p className="text-xs text-zinc-500">Email</p>
          <p className="mt-1 truncate text-zinc-950">{user.email || 'Signed in'}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">Usage</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-zinc-50 px-3 py-2">
              <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
              <p className="mt-1 truncate text-sm font-medium text-zinc-950">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
