export default function ApiKeysPage() {
  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">API keys</h2>
        </div>
        <div className="px-4 py-5">
          <p className="text-sm leading-relaxed text-zinc-500">
            API key creation will connect Supabase login to the KeepDB backend. For now, use the
            backend-generated key in the agent setup page.
          </p>
        </div>
      </section>
    </div>
  );
}
