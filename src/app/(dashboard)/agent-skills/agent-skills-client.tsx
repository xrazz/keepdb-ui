'use client';

import { Copy, Download } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AgentApiKey } from '@/lib/keepdb/agent-keys';
import {
  buildAgentMarkdown,
  buildClaudeMarkdown,
  buildCodexSkillMarkdown,
  buildMcpCommand,
} from '@/lib/keepdb/agent-instructions';

type AgentSkillsClientProps = {
  keys: AgentApiKey[];
};

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
    >
      <Copy className="size-3.5" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function InstallRow({
  title,
  description,
  path,
  filename,
  text,
}: {
  title: string;
  description: string;
  path: string;
  filename: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-950">{title}</p>
        <p className="mt-1 text-sm font-medium text-zinc-500">{description}</p>
        <p className="mt-2 truncate text-xs font-medium text-zinc-400">{path}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <CopyButton text={text} />
        <button
          type="button"
          onClick={() => downloadText(filename, text)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Download className="size-3.5" />
          Download
        </button>
      </div>
    </div>
  );
}

export function AgentSkillsClient({ keys }: AgentSkillsClientProps) {
  const [apiKey, setApiKey] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const agentMd = useMemo(
    () => buildAgentMarkdown({ apiKey }),
    [apiKey],
  );
  const codexSkill = useMemo(
    () => buildCodexSkillMarkdown({ apiKey }),
    [apiKey],
  );
  const claudeMd = useMemo(
    () => buildClaudeMarkdown({ apiKey }),
    [apiKey],
  );
  const mcpCommand = useMemo(() => buildMcpCommand(apiKey), [apiKey]);

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-base font-medium text-zinc-950">Agent instructions</h2>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-500">API key</span>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste the full keep_sk key here"
                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm font-medium outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </label>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-600">
            First create a KeepDB API key in{' '}
            <Link href="/agent-setup" className="text-blue-700 hover:underline">
              API keys
            </Link>{' '}
            then paste the full key here. Existing keys only show prefixes for safety.
          </div>

          {keys.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keys.slice(0, 4).map((key) => (
                <span
                  key={key.id}
                  className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-500"
                >
                  {key.name}: {key.keyPrefix}...
                </span>
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <h3 className="text-sm font-medium text-zinc-950">MCP setup</h3>
            </div>
            <div className="space-y-3 px-4 py-4">
              <p className="text-sm font-medium leading-6 text-zinc-600">
                Use this for Claude Code. Paste it once in your terminal and Claude will send this
                API key automatically when it calls KeepDB.
              </p>
              <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-all text-sm font-medium leading-6 text-zinc-700">{mcpCommand}</p>
                <div className="shrink-0">
                  <CopyButton text={mcpCommand} />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <h3 className="text-sm font-medium text-zinc-950">Install files</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              <InstallRow
                title="Generic agents"
                description="Use for Cursor, custom agents, or any agent that reads AGENTS.md."
                path="PROJECT_ROOT/AGENTS.md"
                filename="AGENTS.md"
                text={agentMd}
              />
              <InstallRow
                title="Claude"
                description="Use inside the project where Claude should remember and search KeepDB."
                path="PROJECT_ROOT/CLAUDE.md"
                filename="CLAUDE.md"
                text={claudeMd}
              />
              <InstallRow
                title="Codex skill"
                description="Install as a Codex skill named keepdb."
                path="~/.codex/skills/keepdb/SKILL.md"
                filename="SKILL.md"
                text={codexSkill}
              />
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white">
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-950"
            >
              Preview markdown
              <span className="text-zinc-400">{showPreview ? '-' : '+'}</span>
            </button>
            {showPreview && (
              <textarea
                readOnly
                value={agentMd}
                className="min-h-[420px] w-full resize-y border-t border-zinc-200 bg-white p-4 text-sm font-medium leading-relaxed text-zinc-700 outline-none"
              />
            )}
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            Browser downloads cannot automatically write into local app folders. Download the file, then place it at the path shown above.
          </div>
        </div>
      </section>
    </div>
  );
}
