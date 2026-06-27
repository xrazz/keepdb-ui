'use client';

import { Check, ChevronDown, Copy, Download } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { AgentApiKey, AgentKeyAccess } from '@/lib/keepdb/agent-keys';
import {
  buildAgentMarkdown,
  buildClaudeMarkdown,
  buildCodexMcpCommand,
  buildCodexSkillMarkdown,
  buildMcpCommand,
} from '@/lib/keepdb/agent-instructions';
import type { KeepDbCollection } from '@/lib/keepdb/client';

type AgentSkillsClientProps = {
  collections: KeepDbCollection[];
};

type SetupTarget = 'codex' | 'claude' | 'mcp' | 'skill';

type ApiResponse =
  | { success: true; key: AgentApiKey; rawKey: string }
  | { success: false; message: string };

const accessOptions: { value: AgentKeyAccess; label: string }[] = [
  { value: 'read_write', label: 'Read + write' },
  { value: 'read', label: 'Read only' },
  { value: 'write', label: 'Write only' },
  { value: 'read_write_delete', label: 'Read + write + delete' },
];

const targetConfig: Record<SetupTarget, { title: string; description: string; name: string }> = {
  codex: {
    title: 'Codex MCP',
    description: 'Create a scoped key and copy the Codex MCP setup command.',
    name: 'Codex MCP key',
  },
  claude: {
    title: 'Claude MCP',
    description: 'Create a scoped key and copy the Claude MCP setup command.',
    name: 'Claude MCP key',
  },
  mcp: {
    title: 'Other MCP',
    description: 'Create a scoped key for any MCP client that accepts an HTTP server URL.',
    name: 'MCP key',
  },
  skill: {
    title: 'Agent skill',
    description: 'Create a scoped key and copy or download an AGENTS.md style setup file.',
    name: 'Agent skill key',
  },
};

function CodexMark() {
  return (
    <Image src="/codex_light.svg" alt="" width={20} height={20} className="size-5" aria-hidden="true" />
  );
}

function ClaudeMark() {
  return (
    <Image src="/claude-ai-icon.svg" alt="" width={20} height={20} className="size-5" aria-hidden="true" />
  );
}

function TargetIcon({ target }: { target: SetupTarget }) {
  if (target === 'codex') return <CodexMark />;
  if (target === 'claude') return <ClaudeMark />;
  if (target === 'skill') {
    return <Image src="/icons8-ai-48.png" alt="" width={20} height={20} className="size-5" aria-hidden="true" />;
  }
  return (
    <Image
      src="/model-context-protocol-light.svg"
      alt=""
      width={20}
      height={20}
      className="size-5"
      aria-hidden="true"
    />
  );
}

function SelectControl({
  children,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-9 w-full appearance-none rounded-full border border-zinc-200/70 bg-zinc-50 pl-3 pr-10 text-xs font-medium text-zinc-600 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] outline-none focus:border-zinc-300 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        strokeWidth={1.8}
      />
    </div>
  );
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
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
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function ManualSetupBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md bg-zinc-50 px-3 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-950">{title}</p>
        <CopyButton text={text} />
      </div>
      <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
        {text}
      </pre>
    </div>
  );
}

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

const manualCodexCommand = `export KEEPDB_API_KEY="keep_sk_your_api_key"

codex mcp add keepdb \\
  --url https://mcp.keepdb.dev/mcp \\
  --bearer-token-env-var KEEPDB_API_KEY`;

const manualClaudeCommand = `claude mcp add --transport http keepdb https://mcp.keepdb.dev/mcp \\
  --header "Authorization: Bearer keep_sk_your_api_key"`;

const manualMcpConfig = `{
  "mcpServers": {
    "keepdb": {
      "type": "http",
      "url": "https://mcp.keepdb.dev/mcp",
      "headers": {
        "Authorization": "Bearer keep_sk_your_api_key"
      }
    }
  }
}`;

function commandForTarget(target: SetupTarget, rawKey: string) {
  if (target === 'codex') return buildCodexMcpCommand(rawKey);
  if (target === 'claude') return buildMcpCommand(rawKey);
  if (target === 'skill') return buildAgentMarkdown({ apiKey: rawKey });

  return `{
  "mcpServers": {
    "keepdb": {
      "type": "http",
      "url": "https://mcp.keepdb.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${rawKey}"
      }
    }
  }
}`;
}

function markdownForTarget(target: SetupTarget, rawKey: string) {
  if (target === 'codex') return buildCodexSkillMarkdown({ apiKey: rawKey });
  if (target === 'claude') return buildClaudeMarkdown({ apiKey: rawKey });
  return buildAgentMarkdown({ apiKey: rawKey });
}

function targetFilename(target: SetupTarget) {
  if (target === 'codex') return 'SKILL.md';
  if (target === 'claude') return 'CLAUDE.md';
  if (target === 'skill') return 'AGENTS.md';
  return 'AGENTS.md';
}

function setupPromptForTarget(target: SetupTarget, rawKey: string) {
  const command = commandForTarget(target, rawKey);
  const markdown = markdownForTarget(target, rawKey);
  const filename = targetFilename(target);

  if (target === 'skill') {
    return `Set up KeepDB memory for this agent.

Create or update ${filename} with the instructions below.

After saving it, use KeepDB whenever I ask you to save, remember, search, recall, list, or fetch project memory.

${markdown}`;
  }

  if (target === 'mcp') {
    return `Set up KeepDB MCP for this agent.

Use this MCP client configuration to connect the KeepDB remote HTTP MCP server:

${command}

Then create or update ${filename} with the instructions below so you know when to save and search KeepDB.

${markdown}

After setup, verify the KeepDB MCP tools are available. If you cannot edit MCP config or files directly, tell me exactly where to paste each block.`;
  }

  return `Set up KeepDB MCP for this agent.

First run this command to connect the KeepDB MCP server:

${command}

Then create or update ${filename} with the instructions below so you know when to save and search KeepDB.

${markdown}

After setup, verify the KeepDB MCP tools are available. If you cannot run commands or write the file directly, tell me exactly what to paste and where.`;
}

export function AgentSkillsClient({ collections }: AgentSkillsClientProps) {
  const [target, setTarget] = useState<SetupTarget | null>(null);
  const [step, setStep] = useState<'configure' | 'result'>('configure');
  const [access, setAccess] = useState<AgentKeyAccess>('read_write');
  const [scopeMode, setScopeMode] = useState<'global' | 'folder'>('global');
  const [folderMode, setFolderMode] = useState<'existing' | 'new'>('existing');
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const setupPrompt = useMemo(
    () => (target && rawKey ? setupPromptForTarget(target, rawKey) : ''),
    [target, rawKey],
  );

  function openSetup(nextTarget: SetupTarget) {
    setTarget(nextTarget);
    setStep('configure');
    setRawKey('');
    setMessage('');
    setAccess('read_write');
    setScopeMode('global');
    setFolderMode('existing');
    setCollectionId(collections[0]?.id || '');
    setNewCollectionName('');
  }

  function closeSetup() {
    setTarget(null);
    setStep('configure');
    setRawKey('');
    setMessage('');
  }

  function scopeValue() {
    if (scopeMode === 'global') return '__all__';
    if (folderMode === 'new') return '__new__';
    return collectionId;
  }

  function updateScope(value: string) {
    setMessage('');
    if (value === '__all__') {
      setScopeMode('global');
      setFolderMode('existing');
      return;
    }
    setScopeMode('folder');
    if (value === '__new__') {
      setFolderMode('new');
      return;
    }
    setFolderMode('existing');
    setCollectionId(value);
  }

  async function createScopedKey() {
    if (!target) return;
    if (scopeMode === 'folder' && folderMode === 'existing' && !collectionId) {
      setMessage('Choose a folder first.');
      return;
    }
    if (scopeMode === 'folder' && folderMode === 'new' && !newCollectionName.trim()) {
      setMessage('Name the folder first.');
      return;
    }

    setCreating(true);
    setMessage('');
    const response = await fetch('/api/keepdb/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: targetConfig[target].name,
        access,
        collectionId: scopeMode === 'folder' && folderMode === 'existing' ? collectionId : null,
        collectionName: scopeMode === 'folder' && folderMode === 'new' ? newCollectionName : null,
      }),
    });
    const body = (await response.json()) as ApiResponse;

    if (body.success) {
      setRawKey(body.rawKey);
      setStep('result');
    } else {
      setMessage(body.message || 'Could not create setup key.');
    }
    setCreating(false);
  }

  const selectedConfig = target ? targetConfig[target] : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-2">
        {(['codex', 'claude'] as SetupTarget[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => openSetup(item)}
            className="flex items-center justify-between gap-4 rounded-md bg-zinc-100/70 px-3 py-3 text-left hover:bg-zinc-100"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white">
                <TargetIcon target={item} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-zinc-950">Setup {targetConfig[item].title}</span>
                <span className="mt-1 block truncate text-xs font-medium text-zinc-500">{targetConfig[item].description}</span>
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Connect
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {(['mcp'] as SetupTarget[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => openSetup(item)}
            className="flex w-full items-center justify-between gap-4 rounded-md bg-zinc-100/70 px-3 py-2 text-left hover:bg-zinc-100"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white">
                <TargetIcon target={item} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-zinc-950">{targetConfig[item].title}</span>
                <span className="mt-1 block truncate text-xs font-medium text-zinc-500">{targetConfig[item].description}</span>
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Connect
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">Agent skill</h2>
        <button
          type="button"
          onClick={() => openSetup('skill')}
          className="flex w-full items-center justify-between gap-4 rounded-md bg-zinc-100/70 px-3 py-2 text-left hover:bg-zinc-100"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white">
              <TargetIcon target="skill" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-950">Add skill</span>
              <span className="mt-1 block truncate text-xs font-medium text-zinc-500">
                Create a scoped key, then copy or download the agent instructions.
              </span>
            </span>
          </span>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-700">
            +
          </span>
        </button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">Manual MCP setup</h2>
        <p className="text-sm font-medium leading-relaxed text-zinc-500">
          Use this only if you want to set up MCP yourself. First create an API key from the API keys tab, then replace
          <span className="text-zinc-700"> keep_sk_your_api_key </span>
          with the full key shown once.
        </p>
        <div className="space-y-2">
          <ManualSetupBlock title="Codex" text={manualCodexCommand} />
          <ManualSetupBlock title="Claude Code" text={manualClaudeCommand} />
          <ManualSetupBlock title="Other MCP client" text={manualMcpConfig} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-950">API documentation</h2>
        <div className="space-y-2">
          <div className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-sm font-medium text-zinc-950">Authentication</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-500">
              Every API request needs an API key in the Authorization header. Key scopes decide whether the request can read,
              write, delete, or access only one folder.
            </p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
{`Authorization: Bearer keep_sk_your_api_key
Content-Type: application/json`}
            </pre>
          </div>

          <div className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-sm font-medium text-zinc-950">Save memory</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-500">
              Use this for feedback, logs, notes, prompts, links, or agent context. KeepDB stores the full content and indexes it for search.
            </p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
{`POST https://api.keepdb.dev/memory
Authorization: Bearer keep_sk_...
Content-Type: application/json

{
  "folder": "app-feedback",
  "content": "Camera crashes on iPhone 14",
  "metadata": {
    "source": "ios",
    "appVersion": "1.0"
  }
}`}
            </pre>
          </div>
          <div className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-sm font-medium text-zinc-950">Search memory</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-500">
              Search can be global or folder-scoped. Date filters are optional and useful for recent feedback, weekly logs, or older decisions.
            </p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
{`GET https://api.keepdb.dev/memory?query=cavenote%20feedback&limit=10
Authorization: Bearer keep_sk_...

Optional filters:
folder=app-feedback
createdAfter=2026-06-01T00:00:00Z
createdBefore=2026-06-30T23:59:59Z`}
            </pre>
          </div>
          <div className="rounded-md bg-zinc-50 px-3 py-2">
            <p className="text-sm font-medium text-zinc-950">Common responses</p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
{`Missing key:
{ "success": false, "status": 401, "message": "API key is required" }

Invalid key:
{ "success": false, "status": 401, "message": "Invalid API key" }

Scope blocked:
{ "success": false, "status": 403, "message": "API key cannot access this folder or action" }`}
            </pre>
          </div>
        </div>
      </section>

      {target && selectedConfig && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/80 px-4 pt-24">
          <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(24,24,27,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <TargetIcon target={target} />
                  <h2 className="truncate text-sm font-medium text-zinc-950">{selectedConfig.title}</h2>
                </div>
                <p className="mt-1 text-xs font-medium text-zinc-500">{selectedConfig.description}</p>
              </div>
            </div>

            {step === 'configure' ? (
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-zinc-500">Access</span>
                    <SelectControl value={access} onChange={(event) => setAccess(event.target.value as AgentKeyAccess)}>
                      {accessOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectControl>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-zinc-500">Folders</span>
                    <SelectControl value={scopeValue()} onChange={(event) => updateScope(event.target.value)}>
                      <option value="__all__">All folders</option>
                      <option value="__new__">+ Create new folder...</option>
                      {collections.length === 0 ? (
                        <option value="">No folders yet</option>
                      ) : (
                        collections.map((collection) => (
                          <option key={collection.id} value={collection.id}>
                            {collection.name}
                          </option>
                        ))
                      )}
                    </SelectControl>
                  </label>
                </div>

                {scopeMode === 'folder' && folderMode === 'new' && (
                  <input
                    value={newCollectionName}
                    onChange={(event) => setNewCollectionName(event.target.value)}
                    placeholder="New folder name"
                    className="h-9 w-full rounded-full border border-zinc-200/70 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 shadow-[inset_0_1px_2px_rgba(24,24,27,0.04)] outline-none placeholder:text-zinc-400 focus:border-zinc-300"
                  />
                )}

                {message && <p className="text-xs font-medium text-amber-700">{message}</p>}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeSetup}
                    className="h-8 rounded-full bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createScopedKey}
                    disabled={creating}
                    className="h-8 rounded-full bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating ? 'Creating...' : 'Next'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-zinc-50 px-3 py-2">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-950">Paste this into your agent</p>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        It asks the agent to set up MCP and save the KeepDB instructions in one go.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CopyButton text={setupPrompt} />
                      <button
                        type="button"
                        onClick={() => downloadText('keepdb-setup-prompt.md', setupPrompt)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      >
                        <Download className="size-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 font-[family-name:var(--font-dm-sans)] text-xs font-medium leading-relaxed text-zinc-700">
                    {setupPrompt}
                  </pre>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeSetup}
                    className="h-8 rounded-full bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
