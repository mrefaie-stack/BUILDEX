import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase';

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

    const supa = getSupabaseService();
    if (!supa) return NextResponse.json({ ok: true, stored: false });

    try {
      // Try update first, insert if not found
      const { data: existing } = await supa
        .from('visitors')
        .select('id')
        .eq('visitor_id', visitor_id)
        .maybeSingle();

      if (existing) {
        await supa
          .from('visitors')
          .update({
            last_seen: new Date().toISOString(),
            selected_path: selected_path ?? null,
            current_level: current_level ?? null
          })
          .eq('visitor_id', visitor_id);
      } else {
        await supa.from('visitors').insert({
          visitor_id,
          selected_path: selected_path ?? null,
          current_level: current_level ?? null,
          user_agent: user_agent ?? null,
          source: source ?? null
        });
      }
    } catch {
      return NextResponse.json({ ok: true, stored: false });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}
