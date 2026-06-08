import { NextRequest, NextResponse } from 'next/server';
import { searchKeepDbMemories } from '@/lib/keepdb/client';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || request.nextUrl.searchParams.get('query') || '';
  const limit = Number(request.nextUrl.searchParams.get('limit') || 10);

  if (!query.trim()) {
    return NextResponse.json(
      { configured: true, success: false, message: 'Query is required' },
      { status: 400 },
    );
  }

  const response = await searchKeepDbMemories(query, limit);
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
