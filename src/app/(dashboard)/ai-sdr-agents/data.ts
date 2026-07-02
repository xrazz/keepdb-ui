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
  chats: SdrChat[];
};

export type SdrChat = {
  id: string;
  leadName: string;
  leadPhone: string;
  status: 'Open' | 'Booked' | 'Needs reply' | 'Review';
  source: string;
  lastMessage: string;
  lastActive: string;
  unread: number;
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
    chats: [
      {
        id: 'sophia-botox',
        leadName: 'Sophia',
        leadPhone: '+1 415 020 1188',
        status: 'Needs reply',
        source: 'Website chat',
        lastMessage: 'I have had it once. I mostly want forehead and maybe around the eyes.',
        lastActive: '10:30 AM',
        unread: 1,
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
        id: 'maya-pricing',
        leadName: 'Maya',
        leadPhone: '+1 415 020 4421',
        status: 'Open',
        source: 'Instagram DM',
        lastMessage: 'How much is a laser consult and do you have evening slots?',
        lastActive: '9:48 AM',
        unread: 0,
        messages: [
          {
            id: 'm5',
            from: 'lead',
            sender: 'Maya',
            content: 'How much is a laser consult and do you have evening slots?',
            time: '9:44 AM',
          },
          {
            id: 'm6',
            from: 'agent',
            sender: 'Medspa SDR',
            content: 'Consults are complimentary this month. Evening availability depends on the treatment area. Which laser service are you interested in?',
            time: '9:48 AM',
          },
        ],
      },
      {
        id: 'nora-booked',
        leadName: 'Nora',
        leadPhone: '+1 415 020 7710',
        status: 'Booked',
        source: 'WhatsApp',
        lastMessage: 'Perfect, Thursday at 3 works.',
        lastActive: 'Yesterday',
        unread: 0,
        messages: [
          {
            id: 'm7',
            from: 'lead',
            sender: 'Nora',
            content: 'Perfect, Thursday at 3 works.',
            time: 'Yesterday',
          },
          {
            id: 'm8',
            from: 'system',
            sender: 'KeepDB',
            content: 'Appointment booked. Conversation summary saved to the SDR memory folder.',
            time: 'Yesterday',
          },
        ],
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
    chats: [
      {
        id: 'marcus-leak',
        leadName: 'Marcus',
        leadPhone: '+1 512 090 4412',
        status: 'Needs reply',
        source: 'SMS',
        lastMessage: 'Staining after rain. Not dripping right now.',
        lastActive: '9:14 AM',
        unread: 1,
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
        id: 'julia-insurance',
        leadName: 'Julia',
        leadPhone: '+1 512 090 8712',
        status: 'Review',
        source: 'GHL form',
        lastMessage: 'Insurance said I need an estimate first. Can you help?',
        lastActive: 'Yesterday',
        unread: 0,
        messages: [
          {
            id: 'r4',
            from: 'lead',
            sender: 'Julia',
            content: 'Insurance said I need an estimate first. Can you help?',
            time: 'Yesterday',
          },
          {
            id: 'r5',
            from: 'system',
            sender: 'KeepDB',
            content: 'Review suggested: insurance claim question should hand off to an estimator.',
            time: 'Yesterday',
          },
        ],
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
    chats: [],
  },
];

export function getSdrAgent(agentId: string) {
  const agent = sdrAgents.find((item) => item.id === agentId);
  if (!agent) notFound();
  return agent;
}

export function getSdrChat(agentId: string, chatId: string) {
  const agent = getSdrAgent(agentId);
  const chat = agent.chats.find((item) => item.id === chatId);
  if (!chat) notFound();
  return { agent, chat };
}
