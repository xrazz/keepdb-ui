export default function ApiKeysLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse space-y-4 pb-12">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="h-8 w-full max-w-[180px] rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]" />
          <div className="h-8 w-[132px] rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]" />
          <div className="h-8 w-[148px] rounded-full border border-zinc-200/70 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)]" />
        </div>
        <div className="h-8 w-28 rounded-full bg-blue-100" />
      </div>

      <div className="space-y-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex min-w-0 items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <div className="h-4 w-32 rounded bg-zinc-100" />
                <div className="h-3 w-44 rounded bg-zinc-100" />
                <div className="hidden h-3 w-20 rounded bg-zinc-100 sm:block" />
                <div className="hidden h-3 w-24 rounded bg-zinc-100 lg:block" />
              </div>
            </div>
            <div className="hidden h-6 w-24 rounded-full bg-blue-100 sm:block" />
            <div className="h-8 w-16 rounded-full bg-red-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
