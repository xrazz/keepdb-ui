import { NextResponse } from 'next/server';
import { listKeepDbCollections } from '@/lib/keepdb/client';

export async function GET() {
  const response = await listKeepDbCollections();
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
