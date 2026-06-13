export default function DashboardLoading() {
  return (
    <div className="w-full animate-pulse pb-12">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-20 rounded-md border border-zinc-200 bg-zinc-50" />
        <div className="h-20 rounded-md border border-zinc-200 bg-zinc-50" />
        <div className="h-20 rounded-md border border-zinc-200 bg-zinc-50" />
      </div>

      <div className="mt-8 rounded-md border border-zinc-200 bg-white">
        <div className="h-11 border-b border-zinc-200 bg-zinc-50" />
        <div className="space-y-3 px-4 py-4">
          <div className="h-5 w-2/3 rounded bg-zinc-100" />
          <div className="h-5 w-5/6 rounded bg-zinc-100" />
          <div className="h-5 w-1/2 rounded bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
