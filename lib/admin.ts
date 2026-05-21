import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'mk_admin';

export function isAdminAuthenticated(): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const c = cookies().get(ADMIN_COOKIE);
  if (!c?.value) return false;
  return c.value === expected;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 8 // 8 hours
  };
}
