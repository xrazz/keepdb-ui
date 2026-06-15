export default function FoldersLoading() {
  return (
    <div className="w-full animate-pulse pb-12">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full rounded-md bg-zinc-100 sm:max-w-sm" />
        <div className="h-10 w-40 rounded-md bg-zinc-100" />
      </div>

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-4 w-20 rounded bg-zinc-100" />
        </div>
        <div className="divide-y divide-zinc-100">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="h-5 w-40 rounded bg-zinc-100" />
              <div className="h-5 w-24 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
