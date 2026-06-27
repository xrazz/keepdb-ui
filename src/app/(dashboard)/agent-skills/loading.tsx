export default function AgentSkillsLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse space-y-4 pb-12">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="h-20 rounded-md bg-zinc-100/70" />
        <div className="h-20 rounded-md bg-zinc-100/70" />
      </div>
      <div className="h-16 rounded-md bg-zinc-100/70" />

      <section className="space-y-3 pt-2">
        <div className="h-4 w-24 rounded bg-zinc-100" />
        <div className="h-16 rounded-md bg-zinc-100/70" />
      </section>

      <section className="space-y-3 pt-2">
        <div className="h-4 w-32 rounded bg-zinc-100" />
        <div className="h-3 w-2/3 rounded bg-zinc-100" />
        <div className="grid gap-2 md:grid-cols-3">
          <div className="h-28 rounded-md bg-zinc-100/70" />
          <div className="h-28 rounded-md bg-zinc-100/70" />
          <div className="h-28 rounded-md bg-zinc-100/70" />
        </div>
      </section>

      <section className="space-y-3 pt-2">
        <div className="h-4 w-32 rounded bg-zinc-100" />
        <div className="space-y-2">
          <div className="h-24 rounded-md bg-zinc-100/70" />
          <div className="h-24 rounded-md bg-zinc-100/70" />
          <div className="h-24 rounded-md bg-zinc-100/70" />
        </div>
      </section>
    </div>
  );
}
