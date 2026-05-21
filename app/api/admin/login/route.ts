import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) ?? {};
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'ADMIN_PASSWORD not configured' },
      { status: 500 }
    );
  }
  if (password !== expected) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, expected, adminCookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
