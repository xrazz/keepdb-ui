export default function FoldersLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse pb-12">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-9 w-full rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:max-w-sm" />
        <div className="h-9 rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] sm:w-44" />
      </div>

      <div className="space-y-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center justify-between gap-4 rounded-md bg-zinc-50 px-3 py-2">
            <div className="h-4 w-40 rounded bg-zinc-100" />
            <div className="h-4 w-24 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
