import { hasKeepDbConnection } from '@/lib/keepdb/client';
import { ConnectForm } from './connect-form';

export default async function ApiKeysPage() {
  const connected = await hasKeepDbConnection();

  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Agent connection</h2>
        </div>
        <ConnectForm connected={connected} />
      </section>
    </div>
  );
}
