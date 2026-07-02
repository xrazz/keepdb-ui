import { WhatsappAgentScreen } from '../../../components/whatsapp-agent-screen';
import { getSdrChat } from '../../../data';

type ChatPageProps = {
  params: Promise<{ agentId: string; chatId: string }>;
};

export default async function AiSdrChatPage({ params }: ChatPageProps) {
  const { agentId, chatId } = await params;
  const { agent, chat } = getSdrChat(agentId, chatId);

  return <WhatsappAgentScreen agent={agent} chat={chat} />;
}
