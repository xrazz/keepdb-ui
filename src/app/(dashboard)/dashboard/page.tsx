const stats = [
  { label: 'Total memories', value: '0' },
  { label: 'Collections', value: '0' },
  { label: 'API keys', value: '0' },
];

const setupSteps = [
  {
    title: 'Create your first API key',
    description: 'Generate a KeepDB key that agents and apps can use to save and search memory.',
  },
  {
    title: 'Copy agent instructions',
    description: 'Paste the generated instructions into Codex, Claude, Cursor, or your own agent runtime.',
  },
  {
    title: 'Send a test memory',
    description: 'Store one note, feedback item, or app log, then search it from the dashboard.',
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full pb-12">
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">Quick setup</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {setupSteps.map((step, index) => (
              <div key={step.title} className="flex gap-3 px-4 py-4">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-950">System status</h2>
          </div>
          <div className="space-y-4 px-4 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Auth</span>
              <span className="font-medium text-zinc-950">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">API key</span>
              <span className="font-medium text-zinc-400">Not created</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Memory sync</span>
              <span className="font-medium text-zinc-400">Waiting</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
