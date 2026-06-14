export default function ApiKeysLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse space-y-4 pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-4 w-36 rounded bg-zinc-100" />
        </div>
        <div className="space-y-3 px-4 py-4">
          <div className="h-10 w-full rounded-md bg-zinc-100" />
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="mb-1 h-3 w-12 rounded bg-zinc-100" />
              <div className="h-10 rounded-md bg-zinc-100" />
            </div>
            <div>
              <div className="mb-1 h-3 w-12 rounded bg-zinc-100" />
              <div className="h-10 rounded-md bg-zinc-100" />
            </div>
            <div>
              <div className="mb-1 h-3 w-12 rounded bg-zinc-100" />
              <div className="h-10 rounded-md bg-zinc-100" />
            </div>
          </div>
          <div className="h-10 w-28 rounded-md bg-zinc-100" />
        </div>
      </section>

      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-4 w-32 rounded bg-zinc-100" />
        </div>
        <div className="divide-y divide-zinc-200">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 rounded bg-zinc-100" />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="h-6 w-20 rounded bg-zinc-100" />
                  <div className="h-6 w-24 rounded bg-zinc-100" />
                  <div className="h-4 w-44 rounded bg-zinc-100" />
                </div>
              </div>
              <div className="h-8 w-16 rounded-md bg-zinc-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
