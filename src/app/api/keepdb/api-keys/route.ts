import { NextResponse } from 'next/server';
import { listKeepDbApiKeys } from '@/lib/keepdb/client';

export async function GET() {
  const response = await listKeepDbApiKeys();
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
