export default function MemoriesLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse pb-12">
      <div className="mb-4 h-9 w-40 rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]" />

      <div className="space-y-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="grid gap-2 rounded-md bg-zinc-50 px-3 py-2 sm:grid-cols-[140px_1fr_120px] sm:items-center sm:gap-3"
          >
            <div className="h-4 w-28 rounded bg-zinc-100" />
            <div className="h-4 w-4/5 rounded bg-zinc-100" />
            <div className="h-3 w-20 rounded bg-zinc-100 sm:justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
