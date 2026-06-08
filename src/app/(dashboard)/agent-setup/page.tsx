import { AgentKeyManager } from './agent-key-manager';
import { listAgentApiKeys } from '@/lib/keepdb/agent-keys';

export default async function AgentSetupPage() {
  const keys = await listAgentApiKeys();

  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Connect agents and APIs</h2>
        </div>
        <div className="px-4 py-5 text-sm leading-relaxed text-zinc-500">
          Create a user-facing API key here, then paste it into Codex, Claude, MCP, or your app backend.
        </div>
      </section>

      <div className="mt-4">
        <AgentKeyManager initialKeys={keys} />
      </div>
    </div>
  );
}
