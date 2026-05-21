import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------- Public (browser + safe server reads) ----------
let _browserClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (_browserClient) return _browserClient;
  _browserClient = createClient(url, anon, {
    auth: { persistSession: false }
  });
  return _browserClient;
}

// ---------- Service role (server only — admin reads/writes) ----------
let _serviceClient: SupabaseClient | null = null;

export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  if (_serviceClient) return _serviceClient;
  _serviceClient = createClient(url, service, {
    auth: { persistSession: false }
  });
  return _serviceClient;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
