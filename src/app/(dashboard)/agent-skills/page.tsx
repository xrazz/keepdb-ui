import { listKeepDbCollections } from '@/lib/keepdb/client';
import { AgentSkillsClient } from './agent-skills-client';

export default async function AgentSkillsPage() {
  const collectionsResponse = await listKeepDbCollections();
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];

  return (
    <div className="w-full max-w-3xl pb-12">
      <AgentSkillsClient collections={collections} />
    </div>
  );
}
