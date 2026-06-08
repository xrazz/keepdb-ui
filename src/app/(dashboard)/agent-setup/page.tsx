export default function AgentSetupPage() {
  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Connect an agent</h2>
        </div>
        <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-zinc-500">
          <p>
            Connect Codex, Claude, Cursor, or your app backend so they can save and search your KeepDB memory.
          </p>
          <p>
            This page will become the simple copy-paste setup flow. For now, your existing agent instructions keep working.
          </p>
        </div>
      </section>
    </div>
  );
}
