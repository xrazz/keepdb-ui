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
      <AgentKeyManager initialKeys={keys} collections={collections} />
    </div>
  );
}
