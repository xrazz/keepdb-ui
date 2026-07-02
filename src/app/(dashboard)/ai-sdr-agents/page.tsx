import { SdrAgentsDashboard } from './components/sdr-agents-dashboard';
import { sdrAgents } from './data';

export default function AiSdrAgentsPage() {
  return <SdrAgentsDashboard agents={sdrAgents} />;
}
