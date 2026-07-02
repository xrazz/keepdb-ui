import { UsersRound } from 'lucide-react';
import {
  listKeepDbCollections,
  listKeepDbMemories,
  type KeepDbCollection,
  type KeepDbMemory,
} from '@/lib/keepdb/client';
import { TaskSpacePage } from '../task-space-page';

const sdrFolders = [
  {
    name: 'sales-scripts',
    description: 'Opening lines, qualification paths, CTA language, and offer framing.',
  },
  {
    name: 'lead-qualification',
    description: 'Questions, routing criteria, disqualifiers, and CRM field rules.',
  },
  {
    name: 'objections',
    description: 'Common objections, approved replies, proof points, and follow-up angles.',
  },
  {
    name: 'booking-rules',
    description: 'Calendar logic, service routing, reminders, reschedules, and handoff notes.',
  },
  {
    name: 'lead-replies',
    description: 'Real prospect messages, replies, transcripts, and intent examples.',
  },
  {
    name: 'unknown-questions',
    description: 'Questions your bots could not answer yet, ready for review and approval.',
  },
];

const sdrKeywords = [
  'sdr',
  'sales',
  'lead',
  'qualification',
  'objection',
  'booking',
  'appointment',
  'closebot',
  'follow-up',
];

function relatedCollections(collections: KeepDbCollection[]) {
  return collections.filter((collection) =>
    sdrKeywords.some((keyword) => collection.name.toLowerCase().includes(keyword))
  );
}

function relatedMemories(memories: KeepDbMemory[]) {
  return memories.filter((memory) =>
    sdrKeywords.some((keyword) => {
      const normalizedCollection = memory.collection.toLowerCase();
      const normalizedContent = memory.content.toLowerCase();
      return normalizedCollection.includes(keyword) || normalizedContent.includes(keyword);
    })
  );
}

export default async function AiSdrAgentsPage() {
  const [collectionsResponse, memoriesResponse] = await Promise.all([
    listKeepDbCollections(),
    listKeepDbMemories(50),
  ]);
  const collections = collectionsResponse.success ? collectionsResponse.data.results : [];
  const memories = memoriesResponse.success ? memoriesResponse.data.results : [];
  const sdrCollections = relatedCollections(collections);
  const sdrMemories = relatedMemories(memories);
  const totalSdrMemories = sdrCollections.reduce((sum, collection) => sum + collection.memories, 0);

  return (
    <TaskSpacePage
      title="AI SDR Agents"
      description="Organize the scripts, objections, booking rules, lead replies, and follow-up context behind every AI sales rep."
      icon={UsersRound}
      collections={collections}
      memories={sdrMemories}
      primaryAction={{ label: 'Open memories', href: '/memories?collection=sales-scripts' }}
      secondaryAction={{ label: 'Search SDR memory', href: '/search?q=ai%20sdr' }}
      folders={sdrFolders}
      stats={[
        { label: 'SDR folders', value: sdrCollections.length.toLocaleString() },
        { label: 'SDR memories', value: totalSdrMemories.toLocaleString() },
        { label: 'Recent matches', value: sdrMemories.length.toLocaleString() },
      ]}
    />
  );
}
