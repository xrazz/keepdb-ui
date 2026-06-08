import { NextResponse } from 'next/server';
import { getOrCreateDashboardClientKey } from '@/lib/keepdb/dashboard-client-key';

export async function POST() {
  try {
    await getOrCreateDashboardClientKey();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Could not provision KeepDB connection.',
      },
      { status: 500 },
    );
  }
}
