import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Treat anything that looks like a placeholder from .env.example as "not
 * set". This keeps the site safe to deploy with a copied .env file: every
 * Supabase call becomes a soft no-op until real credentials are in place.
 */
function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  if (!v) return true;
  return (
    v.includes('your-project') ||
    v.includes('your-anon-key') ||
    v.includes('your-service-role') ||
    v.startsWith('your-') ||
    v === 'changeme' ||
    v === 'change-me-now'
  );
}

function isValidUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

// ---------- Public (browser + safe server reads) ----------
let _browserClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isPlaceholder(url) || isPlaceholder(anon) || !isValidUrl(url)) return null;
  if (_browserClient) return _browserClient;
  _browserClient = createClient(url!, anon!, {
    auth: { persistSession: false }
  });
  return _browserClient;
}

// ---------- Service role (server only — admin reads/writes) ----------
let _serviceClient: SupabaseClient | null = null;

export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (isPlaceholder(url) || isPlaceholder(service) || !isValidUrl(url)) {
    return null;
  }
  if (_serviceClient) return _serviceClient;
  _serviceClient = createClient(url!, service!, {
    auth: { persistSession: false }
  });
  return _serviceClient;
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !isPlaceholder(url) && !isPlaceholder(anon) && isValidUrl(url);
}
