export default function SettingsLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse space-y-6 pb-12">
      <section className="space-y-3">
        <div className="h-4 w-20 rounded bg-zinc-100" />
        <div className="rounded-md bg-zinc-50 px-3 py-2">
          <div className="h-3 w-12 rounded bg-zinc-100" />
          <div className="mt-2 h-4 w-64 rounded bg-zinc-100" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="h-4 w-16 rounded bg-zinc-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="h-14 rounded-md bg-zinc-50" />
          ))}
        </div>
      </section>
    </div>
  );
}
