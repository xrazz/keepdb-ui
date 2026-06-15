import { listKeepDbMemories } from '@/lib/keepdb/client';
import { FolderDetailClient } from './folder-detail-client';

type FolderPageProps = {
  params: Promise<{ folder: string }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folder: rawFolder } = await params;
  const folder = decodeURIComponent(rawFolder);
  const response = await listKeepDbMemories(200, folder);
  const memories = response.success ? response.data.results : [];

  return (
    <>
      {!response.success && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {response.message}
        </div>
      )}
      <FolderDetailClient folder={folder} memories={memories} />
    </>
  );
}
