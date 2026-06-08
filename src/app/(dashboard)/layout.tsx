import { PageHeader } from './page-header';
import { Sidebar } from './sidebar';
import { requireCurrentUser } from '@/lib/auth/current-user';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireCurrentUser();

  return (
    <main className="flex h-screen overflow-hidden bg-white text-zinc-950 font-[family-name:var(--font-dm-sans)]">
      <Sidebar userEmail={user.email || 'Signed in'} />
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <PageHeader userEmail={user.email || 'Signed in'} />
        <section className="flex min-h-0 flex-1 overflow-y-auto p-8">{children}</section>
      </div>
    </main>
  );
}
