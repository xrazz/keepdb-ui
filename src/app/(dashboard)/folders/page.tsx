import { listKeepDbCollections } from '@/lib/keepdb/client';
import { FolderList } from './folder-list';

export default async function FoldersPage() {
  const response = await listKeepDbCollections();
  const collections = response.success ? response.data.results : [];

  return (
    <div className="w-full max-w-3xl pb-12">
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}

      {collections.length > 0 ? (
        <FolderList collections={collections} />
      ) : (
        <section className="rounded-md bg-zinc-50 px-4 py-5 text-sm font-medium text-zinc-500">
          No folders yet.
        </section>
      )}
    </div>
  );
}
