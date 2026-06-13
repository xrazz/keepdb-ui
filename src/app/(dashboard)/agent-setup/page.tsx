import { AgentKeyManager } from './agent-key-manager';
import { listAgentApiKeys } from '@/lib/keepdb/agent-keys';
import { listKeepDbCollections } from '@/lib/keepdb/client';

export default async function AgentSetupPage() {
  const [keys, collectionsResponse] = await Promise.all([
    listAgentApiKeys(),
    listKeepDbCollections(),
  ]);
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];

  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-950">Connect agents and APIs</h2>
        </div>
        <div className="px-4 py-5 text-sm leading-relaxed text-zinc-500">
          Create user-facing keys for Codex, Claude, MCP, or your app backend. The hidden dashboard key is not shown here.
        </div>
      </section>

      <div className="mt-4">
        <AgentKeyManager initialKeys={keys} collections={collections} />
      </div>
    </div>
  );
}
