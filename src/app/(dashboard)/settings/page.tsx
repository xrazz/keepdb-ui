export default function SettingsPage() {
  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Settings</h2>
        </div>
        <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-zinc-500">
          <p>Account and billing settings will live here later.</p>
          <a
            href="/auth/sign-out"
            className="inline-flex h-[30px] items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Sign out
          </a>
        </div>
      </section>
    </div>
  );
}
