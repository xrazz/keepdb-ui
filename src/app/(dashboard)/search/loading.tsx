export default function SearchLoading() {
  return (
    <div className="w-full max-w-4xl animate-pulse pb-12">
      <div className="mb-6 flex h-12 w-full items-center rounded-md border border-zinc-200 bg-white px-4">
        <div className="mr-3 h-4 w-6 rounded bg-zinc-100" />
        <div className="h-4 w-56 rounded bg-zinc-100" />
      </div>

      <div className="mb-5 h-3 w-36 rounded bg-zinc-100" />

      <div className="space-y-5">
        {[0, 1, 2, 3].map((item) => (
          <div key={item}>
            <div className="h-5 w-2/5 rounded bg-zinc-100" />
            <div className="mt-2 h-3 w-48 rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-4/5 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
