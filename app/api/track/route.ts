import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId, jsonOrNull } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitor_id, event_name, page, metadata } = body ?? {};

    if (!visitor_id || !event_name) {
      return NextResponse.json(
        { ok: false, error: 'visitor_id and event_name required' },
        { status: 400 }
      );
    }

    try {
      const db = getDb();
      db.prepare(
        `INSERT INTO visitor_events (id, visitor_id, event_name, page, metadata)
         VALUES (?, ?, ?, ?, ?)`
      ).run(newId(), visitor_id, event_name, page ?? null, jsonOrNull(metadata));
    } catch (e: any) {
      console.warn('[track] insert failed:', e?.message);
      return NextResponse.json({ ok: true, stored: false });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'bad request' },
      { status: 400 }
    );
  }
}
