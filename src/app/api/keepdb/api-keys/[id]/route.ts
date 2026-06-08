import { NextRequest, NextResponse } from 'next/server';
import { revokeAgentApiKey } from '@/lib/keepdb/agent-keys';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const revoked = await revokeAgentApiKey(id);

    if (!revoked) {
      return NextResponse.json(
        { success: false, message: 'API key not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Could not revoke API key.',
      },
      { status: 400 },
    );
  }
}
