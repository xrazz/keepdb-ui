export default function MemoriesLoading() {
  return (
    <div className="w-full animate-pulse pb-12">
      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-[180px_1fr_140px] border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-5 w-24 rounded bg-zinc-100" />
          <div className="h-5 w-20 rounded bg-zinc-100" />
          <div className="h-5 w-16 rounded bg-zinc-100" />
        </div>

        <div className="divide-y divide-zinc-200">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[180px_1fr_140px] items-center px-4 py-4"
            >
              <div className="h-4 w-28 rounded bg-zinc-100" />
              <div className="h-4 w-4/5 rounded bg-zinc-100" />
              <div className="h-4 w-20 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
