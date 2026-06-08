const collections = [
  { name: 'codex', memories: '0', description: 'Default agent memory collection.' },
  { name: 'cavenote-feedback', memories: '0', description: 'Feedback and app messages.' },
];

export default function CollectionsPage() {
  return (
    <div className="w-full pb-12">
      <div className="grid gap-3 md:grid-cols-2">
        {collections.map((collection) => (
          <article key={collection.name} className="rounded-md border border-zinc-200 bg-white px-4 py-4">
            <p className="font-mono text-sm font-semibold text-zinc-950">{collection.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{collection.description}</p>
            <p className="mt-4 text-xs font-medium text-zinc-400">{collection.memories} memories</p>
          </article>
        ))}
      </div>
    </div>
  );
}
