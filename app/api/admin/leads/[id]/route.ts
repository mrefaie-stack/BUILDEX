import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, parseJsonField } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = [
  'new',
  'contacted',
  'interested',
  'follow_up',
  'converted',
  'rejected'
] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES)
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const db = getDb();
    const row = db
      .prepare('SELECT * FROM leads WHERE id = ?')
      .get(params.id) as any | undefined;

    if (!row) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
    const lead = {
      ...row,
      selected_services: parseJsonField(row.selected_services),
      calculator_result:
        row.calculator_result === null ? null : Number(row.calculator_result)
    };

    const events = row.visitor_id
      ? (db
          .prepare(
            `SELECT * FROM visitor_events WHERE visitor_id = ?
             ORDER BY datetime(created_at) ASC LIMIT 1000`
          )
          .all(row.visitor_id) as any[]).map((e) => ({
          ...e,
          metadata: parseJsonField(e.metadata)
        }))
      : [];

    const bookings = (
      db.prepare('SELECT * FROM bookings WHERE lead_id = ?').all(row.id) as any[]
    ).map((b) => ({
      ...b,
      selected_services: parseJsonField(b.selected_services)
    }));

    return NextResponse.json({ ok: true, lead, events, bookings });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unreachable' },
      { status: 503 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  try {
    const db = getDb();
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(
      parsed.data.status,
      params.id
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unreachable' },
      { status: 503 }
    );
  }
}
