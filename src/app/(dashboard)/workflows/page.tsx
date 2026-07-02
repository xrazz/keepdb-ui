import { Workflow } from 'lucide-react';
import {
  listKeepDbCollections,
  listKeepDbMemories,
  type KeepDbCollection,
  type KeepDbMemory,
} from '@/lib/keepdb/client';
import { TaskSpacePage } from '../task-space-page';

const workflowFolders = [
  {
    name: 'workflow-notes',
    description: 'Automation logic, edge cases, handoff rules, and implementation notes.',
  },
  {
    name: 'n8n-workflows',
    description: 'Agent prompts, node behavior, webhook notes, and run summaries from n8n.',
  },
  {
    name: 'make-workflows',
    description: 'Scenario context, routing rules, tool outputs, and reusable Make patterns.',
  },
  {
    name: 'zapier-workflows',
    description: 'Zap steps, trigger behavior, integration notes, and client-specific automations.',
  },
  {
    name: 'webhook-logs',
    description: 'Important payload summaries, failures, retries, and debugging context.',
  },
  {
    name: 'workflow-templates',
    description: 'Reusable fulfillment patterns your agency can clone across clients.',
  },
];

const workflowKeywords = ['workflow', 'n8n', 'make', 'zapier', 'automation', 'webhook', 'trigger'];

function relatedCollections(collections: KeepDbCollection[]) {
  return collections.filter((collection) =>
    workflowKeywords.some((keyword) => collection.name.toLowerCase().includes(keyword))
  );
}

function relatedMemories(memories: KeepDbMemory[]) {
  return memories.filter((memory) =>
    workflowKeywords.some((keyword) => {
      const normalizedCollection = memory.collection.toLowerCase();
      const normalizedContent = memory.content.toLowerCase();
      return normalizedCollection.includes(keyword) || normalizedContent.includes(keyword);
    })
  );
}

export default async function WorkflowsPage() {
  const [collectionsResponse, memoriesResponse] = await Promise.all([
    listKeepDbCollections(),
    listKeepDbMemories(50),
  ]);
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = memoriesResponse.success ? memoriesResponse.data.results : [];
  const workflowCollections = relatedCollections(collections);
  const workflowMemories = relatedMemories(memories);
  const totalWorkflowMemories = workflowCollections.reduce((sum, collection) => sum + collection.memories, 0);

  return (
    <TaskSpacePage
      title="Workflows"
      description="Keep workflow memory for n8n, Make, Zapier, webhooks, custom agents, and every automation your agency ships."
      icon={Workflow}
      collections={collections}
      memories={workflowMemories}
      primaryAction={{ label: 'Open memories', href: '/memories?collection=workflow-notes' }}
      secondaryAction={{ label: 'Search workflows', href: '/search?q=workflow' }}
      folders={workflowFolders}
      stats={[
        { label: 'Workflow folders', value: workflowCollections.length.toLocaleString() },
        { label: 'Workflow memories', value: totalWorkflowMemories.toLocaleString() },
        { label: 'Recent matches', value: workflowMemories.length.toLocaleString() },
      ]}
    />
  );
}
