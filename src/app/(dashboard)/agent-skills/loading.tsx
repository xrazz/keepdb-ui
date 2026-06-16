export default function AgentSkillsLoading() {
  return (
    <div className="w-full max-w-4xl animate-pulse pb-12">
      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-5 w-36 rounded bg-zinc-100" />
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-10 rounded-md bg-zinc-100" />
            <div className="h-10 rounded-md bg-zinc-100" />
          </div>
          <div className="h-96 rounded-md bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
