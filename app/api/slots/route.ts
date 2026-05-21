import { NextResponse } from 'next/server';
import { getBookedSlots } from '@/lib/db';
import { generateSlots } from '@/lib/slots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const taken = new Set(getBookedSlots());
    const days = generateSlots(taken);
    return NextResponse.json({ ok: true, days });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message },
      { status: 500 }
    );
  }
}
