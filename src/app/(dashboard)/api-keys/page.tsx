export default function ApiKeysPage() {
  return (
    <div className="w-full max-w-3xl pb-12">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-950">Agent connection</h2>
        </div>
        <div className="px-4 py-5 text-sm leading-relaxed text-zinc-500">
          Agent connection setup will live here. The dashboard itself uses your signed-in session and
          a server-side KeepDB key, so nothing sensitive is exposed in the browser.
        </div>
      </section>
    </div>
  );
}
