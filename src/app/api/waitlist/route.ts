import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // ⚠️ Drop your live token string in here when pushing to production
    const KEEPDB_WRITE_KEY = 'keep_sk_wiVF_2asr2p_kc34D4r4syJh2Yw88HEpaeEz8th0gVw'; 

    console.log('Forwarding waitlist target packet:', email);

    // This request mirrors your working curl layout exactly
    const response = await fetch('https://keepdb-api-production.up.railway.app/memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEEPDB_WRITE_KEY}`,
      },
      body: JSON.stringify({
        collection: 'waitlist', 
        content: `Waitlist Signup: ${email}`, 
        metadata: {
          source: 'agent',      // Matches the strict string value from your spec template
          tags: ['waitlist']    // Passes a clean string array descriptor structure
        },
      }),
    });

    const responseText = await response.text();
    console.log(`KeepDB Execution Node Status: ${response.status} ->`, responseText);

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: `Database execution error slot: ${response.status}` },
      { status: response.status }
    );
  } catch (error: any) {
    console.error('Next.js API Engine Proxy Crash:', error);
    return NextResponse.json(
      { success: false, message: 'Internal gateway connection pipeline broke.' },
      { status: 500 }
    );
  }
}