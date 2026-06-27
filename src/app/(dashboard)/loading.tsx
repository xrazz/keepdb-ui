export default function DashboardLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse pb-12">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-14 rounded-md bg-zinc-50" />
        <div className="h-14 rounded-md bg-zinc-50" />
        <div className="h-14 rounded-md bg-zinc-50" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-24 rounded bg-zinc-100" />
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="grid gap-2 rounded-md bg-zinc-50 px-3 py-2 sm:grid-cols-[140px_1fr_120px] sm:items-center sm:gap-3">
              <div className="h-4 w-24 rounded bg-zinc-100" />
              <div className="h-4 w-full rounded bg-zinc-100" />
              <div className="h-3 w-20 rounded bg-zinc-100 sm:justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
