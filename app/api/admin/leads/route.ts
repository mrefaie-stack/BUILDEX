import { NextResponse } from 'next/server';
import { getDb, parseJsonField } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT * FROM leads ORDER BY datetime(created_at) DESC LIMIT 500`
      )
      .all() as any[];

    const leads = rows.map((r) => ({
      ...r,
      selected_services: parseJsonField(r.selected_services),
      calculator_result:
        r.calculator_result === null ? null : Number(r.calculator_result)
    }));

    return NextResponse.json({ ok: true, leads, configured: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unreachable' },
      { status: 500 }
    );
  }
}
