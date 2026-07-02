import { WhatsappAgentScreen } from '../components/whatsapp-agent-screen';
import { getSdrAgent, type SdrAgent } from '../data';

type AgentPageProps = {
  params: Promise<{ agentId: string }>;
  searchParams?: Promise<{ name?: string; client?: string }>;
};

function draftAgent(agentId: string, name?: string, client?: string): SdrAgent {
  const safeName = name?.trim() || 'Draft SDR Agent';
  const safeClient = client?.trim() || 'New client';

  return {
    id: agentId,
    name: safeName,
    client: safeClient,
    channel: 'WhatsApp',
    status: 'Draft',
    goal: 'Qualify leads, answer key questions, and route qualified prospects to the right booking flow.',
    folder: `sdr/${agentId}`,
    leads: 0,
    booked: 0,
    replyRate: '0%',
    lastActive: 'Draft',
    tone: 'Helpful, concise',
    owner: 'Unassigned',
    handoffRule: 'Hand off when the lead asks for a human, pricing approval, or an unsupported request.',
    knowledge: ['sales-scripts', 'lead-qualification', 'objections', 'booking-rules'],
    messages: [
      {
        id: `${agentId}-draft`,
        from: 'system',
        sender: 'KeepDB',
        content: 'Draft SDR agent created. Add scripts, qualification rules, objections, and booking context before launch.',
        time: 'Now',
      },
    ],
  };
}

export default async function AiSdrAgentPage({ params, searchParams }: AgentPageProps) {
  const { agentId } = await params;
  const query = await searchParams;
  const agent = query?.name || query?.client
    ? draftAgent(agentId, query.name, query.client)
    : getSdrAgent(agentId);

  return <WhatsappAgentScreen agent={agent} />;
}
