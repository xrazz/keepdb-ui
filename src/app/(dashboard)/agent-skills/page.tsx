import { listAgentApiKeys } from '@/lib/keepdb/agent-keys';
import { AgentSkillsClient } from './agent-skills-client';

export default async function AgentSkillsPage() {
  const keys = await listAgentApiKeys();

  return (
    <div className="w-full max-w-4xl pb-12">
      <AgentSkillsClient keys={keys} />
    </div>
  );
}
