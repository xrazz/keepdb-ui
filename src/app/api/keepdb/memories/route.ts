import { NextRequest, NextResponse } from 'next/server';
import { listKeepDbMemories } from '@/lib/keepdb/client';

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || 50);
  const response = await listKeepDbMemories(limit);
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
