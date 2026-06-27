import { NextRequest, NextResponse } from 'next/server';
import { createAgentApiKey, listAgentApiKeys, type AgentKeyAccess } from '@/lib/keepdb/agent-keys';

const accessModes = new Set(['read', 'write', 'read_write', 'read_write_delete']);

export async function GET() {
  try {
    const keys = await listAgentApiKeys();
    return NextResponse.json({ success: true, results: keys });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Could not load API keys.',
      },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const access = accessModes.has(body.access) ? (body.access as AgentKeyAccess) : 'read_write';
    const collectionId = typeof body.collectionId === 'string' ? body.collectionId : null;
    const collectionName = typeof body.collectionName === 'string' ? body.collectionName : null;
    const created = await createAgentApiKey({
      name: String(body.name || 'Agent key'),
      access,
      collectionId,
      collectionName,
    });
    return NextResponse.json({ success: true, ...created });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Could not create API key.',
      },
      { status: 400 },
    );
  }
}
