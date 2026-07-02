import { notFound } from 'next/navigation';

export type SdrAgentStatus = 'Live' | 'Draft' | 'Needs review';

export type SdrAgent = {
  id: string;
  name: string;
  client: string;
  channel: string;
  status: SdrAgentStatus;
  goal: string;
  folder: string;
  leads: number;
  booked: number;
  replyRate: string;
  lastActive: string;
  tone: string;
  owner: string;
  handoffRule: string;
  knowledge: string[];
  messages: SdrMessage[];
};

export type SdrMessage = {
  id: string;
  from: 'lead' | 'agent' | 'system';
  sender: string;
  content: string;
  time: string;
};

export const sdrAgents: SdrAgent[] = [
  {
    id: 'medspa-appointment-setter',
    name: 'Medspa Appointment Setter',
    client: 'Luma Medspa',
    channel: 'WhatsApp',
    status: 'Live',
    goal: 'Qualify new injectable and laser leads, answer pricing questions, and book a consult.',
    folder: 'sdr/medspa-appointment-setter',
    leads: 148,
    booked: 37,
    replyRate: '68%',
    lastActive: '12 min ago',
    tone: 'Warm, concise, consultative',
    owner: 'Sales ops',
    handoffRule: 'Hand off when the lead asks about contraindications, financing, or same-day treatment.',
    knowledge: ['sales-scripts', 'lead-qualification', 'objections', 'booking-rules', 'lead-replies'],
    messages: [
      {
        id: 'm1',
        from: 'lead',
        sender: 'Sophia',
        content: 'Hi, do you have Botox appointments this week?',
        time: '10:28 AM',
      },
      {
        id: 'm2',
        from: 'agent',
        sender: 'Medspa SDR',
        content: 'Yes, we have consult slots open this week. Have you had Botox before, or would this be your first time?',
        time: '10:28 AM',
      },
      {
        id: 'm3',
        from: 'lead',
        sender: 'Sophia',
        content: 'I have had it once. I mostly want forehead and maybe around the eyes.',
        time: '10:29 AM',
      },
      {
        id: 'm4',
        from: 'agent',
        sender: 'Medspa SDR',
        content: 'Perfect. For forehead and eye-area concerns, the best next step is a quick consult so the injector can confirm units and pricing. Would morning or afternoon work better?',
        time: '10:30 AM',
      },
    ],
  },
  {
    id: 'roofing-quote-qualifier',
    name: 'Roofing Quote Qualifier',
    client: 'Northstar Roofing',
    channel: 'SMS',
    status: 'Needs review',
    goal: 'Collect roof type, issue, location, urgency, and photos before routing to an estimator.',
    folder: 'sdr/roofing-quote-qualifier',
    leads: 82,
    booked: 19,
    replyRate: '54%',
    lastActive: '1 hr ago',
    tone: 'Direct, helpful, practical',
    owner: 'Estimator team',
    handoffRule: 'Hand off immediately for active leaks, storm damage, or insurance claim questions.',
    knowledge: ['sales-scripts', 'lead-qualification', 'booking-rules', 'unknown-questions'],
    messages: [
      {
        id: 'r1',
        from: 'lead',
        sender: 'Marcus',
        content: 'Need someone to look at a leak near my chimney.',
        time: '9:12 AM',
      },
      {
        id: 'r2',
        from: 'agent',
        sender: 'Roofing SDR',
        content: 'I can help get that routed. Is water currently coming in, or did you notice staining after the last rain?',
        time: '9:13 AM',
      },
      {
        id: 'r3',
        from: 'lead',
        sender: 'Marcus',
        content: 'Staining after rain. Not dripping right now.',
        time: '9:14 AM',
      },
    ],
  },
  {
    id: 'gym-reactivation-agent',
    name: 'Gym Reactivation Agent',
    client: 'Peak Fitness',
    channel: 'WhatsApp',
    status: 'Draft',
    goal: 'Restart conversations with old leads and book trial class calls.',
    folder: 'sdr/gym-reactivation-agent',
    leads: 0,
    booked: 0,
    replyRate: '0%',
    lastActive: 'Not live',
    tone: 'Energetic, casual, low-pressure',
    owner: 'Campaign manager',
    handoffRule: 'Hand off once the lead asks about membership discounts or wants a trainer callback.',
    knowledge: ['sales-scripts', 'objections', 'follow-up'],
    messages: [
      {
        id: 'g1',
        from: 'system',
        sender: 'KeepDB',
        content: 'Draft agent created. Add offer details, trial class rules, and follow-up timing before launch.',
        time: 'Now',
      },
    ],
  },
];

export function getSdrAgent(agentId: string) {
  const agent = sdrAgents.find((item) => item.id === agentId);
  if (!agent) notFound();
  return agent;
}
