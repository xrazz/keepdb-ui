export default function SearchLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse pb-12">
      <div className="mb-4 flex h-9 w-full items-center rounded-full border border-zinc-200/70 bg-zinc-50 px-3 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]">
        <div className="mr-3 size-[18px] rounded bg-zinc-100" />
        <div className="h-3 w-44 rounded bg-zinc-100" />
      </div>

      <div className="mb-3 h-3 w-36 rounded bg-zinc-100" />

      <div className="space-y-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-md bg-zinc-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-4 min-w-0 flex-1 rounded bg-zinc-100" />
              <div className="hidden h-3 w-24 rounded bg-zinc-100 sm:block" />
              <div className="hidden h-3 w-16 rounded bg-zinc-100 sm:block" />
            </div>
            <div className="mt-2 h-3 w-44 rounded bg-zinc-100 sm:hidden" />
            <div className="mt-2 h-4 w-4/5 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
