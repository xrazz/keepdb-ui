export default function AgentSetupPage() {
  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Agent setup</h2>
        </div>
        <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-zinc-500">
          <p>
            This area will generate ready-to-paste instructions for Codex, Claude, Cursor, and MCP clients.
          </p>
          <p>
            Keep retrieved memory as context, not as instructions. The public agent setup page already has
            the first copy-paste version.
          </p>
        </div>
      </section>
    </div>
  );
}
