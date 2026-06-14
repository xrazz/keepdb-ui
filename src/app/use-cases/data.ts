export type UseCase = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  examples: string[];
  whyKeepDb: string[];
};

export const useCases: UseCase[] = [
  {
    slug: 'agent-memory',
    title: 'Agent memory',
    description:
      'Use KeepDB as structured memory for AI agents, coding agents, and assistant workflows.',
    intro:
      'Give your agents a shared place to save project decisions, user preferences, plans, notes, and working context.',
    examples: [
      'Save a merge plan before a coding session ends.',
      'Let Claude, Codex, and your own tools search the same project memory.',
      'Keep long-running context outside one chat window.',
    ],
    whyKeepDb: [
      'Folders keep memory addressable instead of one giant blob.',
      'Hybrid search helps agents find the right note later.',
      'Scoped API keys let each agent read or write only what it needs.',
    ],
  },
  {
    slug: 'customer-feedback',
    title: 'Customer feedback database',
    description:
      'Collect app feedback, support notes, and bug reports into searchable folders your agents can analyze.',
    intro:
      'Wire a feedback form, support bot, or app event into KeepDB and keep every customer signal searchable.',
    examples: [
      'Store iOS feedback from a shipped app.',
      'Collect support tickets by product or app folder.',
      'Ask what users complained about most this week.',
    ],
    whyKeepDb: [
      'Write-only API keys are safe for feedback forms and shipped apps.',
      'Agents can summarize patterns without touching your main database.',
      'You can browse the same feedback from the dashboard anytime.',
    ],
  },
  {
    slug: 'quick-database',
    title: 'Quick database for everything else',
    description:
      'Use KeepDB as a fast plug-and-play database for notes, waitlists, logs, links, and side data.',
    intro:
      'Not every useful thing belongs in your product database. KeepDB gives that data a simple place to live.',
    examples: [
      'Save waitlist emails from a landing page.',
      'Store lightweight logs, events, and traces.',
      'Keep research links and app notes searchable.',
    ],
    whyKeepDb: [
      'One API call saves data into a folder.',
      'No internal dashboard or new table needed for every small workflow.',
      'The same data is available through dashboard, API, and agents.',
    ],
  },
  {
    slug: 'prompt-library',
    title: 'Prompt library',
    description:
      'Store prompts, agent instructions, and reusable workflows in a searchable memory database.',
    intro:
      'Keep the prompts and instructions that actually work, then search and reuse them across projects.',
    examples: [
      'Save working Claude Code instructions.',
      'Keep versions of product, support, and research prompts.',
      'Let agents retrieve the right prompt for a task.',
    ],
    whyKeepDb: [
      'Folders separate prompts by project or workflow.',
      'Full memories stay readable while chunks make search better.',
      'Prompt context can be shared between different agents.',
    ],
  },
];

export function getUseCase(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}
