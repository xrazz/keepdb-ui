export default function MemoriesLoading() {
  return (
    <div className="w-full animate-pulse pb-12">
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 sm:grid-cols-[180px_1fr_140px] sm:gap-0">
          <div className="h-5 w-24 rounded bg-zinc-100" />
          <div className="hidden h-5 w-20 rounded bg-zinc-100 sm:block" />
          <div className="h-5 w-16 rounded bg-zinc-100" />
        </div>

        <div className="divide-y divide-zinc-200">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[180px_1fr_140px] sm:items-center sm:gap-0"
            >
              <div className="h-4 w-28 rounded bg-zinc-100" />
              <div className="h-4 w-4/5 rounded bg-zinc-100" />
              <div className="h-4 w-20 rounded bg-zinc-100 sm:ml-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
