import { NextRequest, NextResponse } from 'next/server';
import { createAgentApiKey, listAgentApiKeys } from '@/lib/keepdb/agent-keys';

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
    const created = await createAgentApiKey(String(body.name || 'Agent key'));
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
