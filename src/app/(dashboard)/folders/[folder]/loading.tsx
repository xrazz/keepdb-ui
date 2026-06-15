export default function FolderDetailLoading() {
  return (
    <div className="w-full animate-pulse pb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-4 w-16 rounded bg-zinc-100" />
          <div className="mt-2 h-9 w-56 rounded bg-zinc-100" />
          <div className="mt-3 h-4 w-28 rounded bg-zinc-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-md bg-zinc-100" />
          <div className="h-9 w-28 rounded-md bg-zinc-100" />
          <div className="h-9 w-28 rounded-md bg-zinc-100" />
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-4 w-24 rounded bg-zinc-100" />
        </div>
        <div className="divide-y divide-zinc-100">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="px-4 py-4">
              <div className="h-5 w-3/4 rounded bg-zinc-100" />
              <div className="mt-2 h-4 w-24 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
