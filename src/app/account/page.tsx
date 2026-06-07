import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-sm text-gray-600 font-[family-name:var(--font-dm-sans)]">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Account</h1>
        <p>Supabase is not configured yet. Add the public Supabase URL and anon key first.</p>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();
  const user = data.user;

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-white text-gray-900 font-medium font-[family-name:var(--font-dm-sans)]">
      <div
        style={{
          backgroundImage: "url('/sky.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2" aria-label="KeepDB home">
            <Image
              src="/keepdb-logo.png"
              alt="KeepDB logo"
              width={56}
              height={56}
              className="rounded-md"
            />
          </Link>
          <div className="flex gap-5 text-sm font-semibold tracking-tight">
            <Link href="/docs" className="text-gray-600 hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/agents" className="text-gray-600 hover:text-black transition-colors">
              Agents
            </Link>
          </div>
        </nav>

        <header className="max-w-2xl mx-auto px-6 pt-12 md:pt-16 pb-24">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-gray-900">
            Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">{user.email}</p>
        </header>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-8 pb-24 relative z-10">
        <div className="text-sm text-gray-600 leading-relaxed space-y-10">
          <section>
            <h2 className="text-sm text-gray-900 font-bold mb-3">Signed in</h2>
            <p>
              Supabase Auth is connected. Next step is linking this session to a KeepDB API key
              creation flow.
            </p>
          </section>

          <section>
            <h2 className="text-sm text-gray-900 font-bold mb-3">User ID</h2>
            <p className="font-mono text-xs break-all text-gray-500">{user.id}</p>
          </section>

          <section>
            <Link
              href="/auth/sign-out"
              className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
            >
              Sign out
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
