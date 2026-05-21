import { NextRequest, NextResponse } from 'next/server';
import { getDb, newId } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitor_id, selected_path, current_level, user_agent, source } =
      body ?? {};

    if (!visitor_id) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    try {
      const db = getDb();
      const existing = db
        .prepare('SELECT id FROM visitors WHERE visitor_id = ?')
        .get(visitor_id) as { id: string } | undefined;

      if (existing) {
        db.prepare(
          `UPDATE visitors
             SET last_seen = datetime('now'),
                 selected_path = COALESCE(?, selected_path),
                 current_level = COALESCE(?, current_level)
           WHERE visitor_id = ?`
        ).run(selected_path ?? null, current_level ?? null, visitor_id);
      } else {
        db.prepare(
          `INSERT INTO visitors
             (id, visitor_id, selected_path, current_level, user_agent, source)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(
          newId(),
          visitor_id,
          selected_path ?? null,
          current_level ?? null,
          user_agent ?? null,
          source ?? null
        );
      }
    } catch (e: any) {
      console.warn('[visitor] write failed:', e?.message);
      return NextResponse.json({ ok: true, stored: false });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}
