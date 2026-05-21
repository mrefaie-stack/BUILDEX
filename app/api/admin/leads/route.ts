import { NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supa = getSupabaseService();
  if (!supa) {
    return NextResponse.json({ ok: true, leads: [], configured: false });
  }
  try {
    const { data, error } = await supa
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, configured: true },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, leads: data ?? [], configured: true });
  } catch (e: any) {
    // Network unreachable / DNS failure / placeholder host — treat as
    // unconfigured rather than 500 so the admin UI stays usable.
    return NextResponse.json({
      ok: true,
      leads: [],
      configured: false,
      transient: e?.message ?? 'unreachable'
    });
  }
}
