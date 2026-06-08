const memories = [
  {
    collection: 'cavenote-feedback',
    preview: 'Cavenote feedback and app messages will appear here after API key sync.',
    created: 'Waiting for key',
  },
];

export default function MemoriesPage() {
  return (
    <div className="w-full pb-12">
      <div className="rounded-md border border-zinc-200 bg-white">
        <div className="grid grid-cols-[180px_1fr_140px] border-b border-zinc-200 px-4 py-3 text-xs font-medium text-zinc-500">
          <span>Collection</span>
          <span>Memory</span>
          <span>Created</span>
        </div>
        {memories.map((memory) => (
          <div key={memory.preview} className="grid grid-cols-[180px_1fr_140px] px-4 py-4 text-sm">
            <span className="font-medium text-zinc-950">{memory.collection}</span>
            <span className="text-zinc-600">{memory.preview}</span>
            <span className="text-zinc-400">{memory.created}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
