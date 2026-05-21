import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase';

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

    const supa = getSupabaseService();
    if (!supa) {
      // Soft no-op when Supabase is not configured — still return 200 so tracking
      // never breaks the user-facing flow during local dev.
      return NextResponse.json({ ok: true, stored: false });
    }

    const { error } = await supa.from('visitor_events').insert({
      visitor_id,
      event_name,
      page: page ?? null,
      metadata: metadata ?? null
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'bad request' },
      { status: 400 }
    );
  }
}
