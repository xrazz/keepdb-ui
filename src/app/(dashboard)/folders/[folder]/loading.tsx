export default function FolderDetailLoading() {
  return (
    <div className="w-full max-w-3xl animate-pulse pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-zinc-100" />
          <div className="h-4 w-36 rounded bg-zinc-100" />
          <div className="h-3 w-20 rounded bg-zinc-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-zinc-100" />
          <div className="h-8 w-24 rounded-full bg-zinc-100" />
          <div className="h-8 w-24 rounded-full bg-zinc-100" />
        </div>
      </div>

      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="grid gap-2 rounded-md bg-zinc-50 px-3 py-2 sm:grid-cols-[1fr_140px] sm:items-center">
            <div className="h-4 w-3/4 rounded bg-zinc-100" />
            <div className="h-3 w-24 rounded bg-zinc-100 sm:justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
