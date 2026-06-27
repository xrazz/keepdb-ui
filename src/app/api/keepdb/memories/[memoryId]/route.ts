import { NextRequest, NextResponse } from 'next/server';
import { deleteKeepDbMemory } from '@/lib/keepdb/client';

type RouteContext = {
  params: Promise<{ memoryId: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { memoryId } = await params;
  const response = await deleteKeepDbMemory(memoryId);
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
