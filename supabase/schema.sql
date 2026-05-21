-- =============================================================
-- MilaKnight — Supabase schema
-- Run this once in the Supabase SQL editor.
-- =============================================================

create extension if not exists "pgcrypto";

create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_id text unique not null,
  first_seen timestamp with time zone default now(),
  last_seen timestamp with time zone default now(),
  selected_path text,
  current_level text,
  source text,
  user_agent text,
  created_at timestamp with time zone default now()
);

create index if not exists visitors_last_seen_idx on visitors(last_seen desc);

create table if not exists visitor_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  event_name text not null,
  page text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists visitor_events_visitor_idx on visitor_events(visitor_id);
create index if not exists visitor_events_event_idx on visitor_events(event_name);
create index if not exists visitor_events_created_idx on visitor_events(created_at desc);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  name text,
  phone text not null,
  city text,
  company_type text,
  selected_package text,
  selected_services jsonb,
  calculator_result numeric,
  source text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists leads_visitor_idx on leads(visitor_id);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  lead_id uuid references leads(id) on delete set null,
  name text,
  phone text,
  city text,
  selected_package text,
  selected_services jsonb,
  booking_source text,
  calendar_booking_url text,
  created_at timestamp with time zone default now()
);

create index if not exists bookings_created_idx on bookings(created_at desc);

-- ---------------- RLS ---------------------------------------
-- Anon clients can only insert events/visitors/leads via the
-- public anon key. Read access is restricted to the service
-- role used by the /api/admin routes.
alter table visitors enable row level security;
alter table visitor_events enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;

drop policy if exists "anon insert visitors" on visitors;
create policy "anon insert visitors" on visitors
  for insert to anon with check (true);

drop policy if exists "anon update visitors" on visitors;
create policy "anon update visitors" on visitors
  for update to anon using (true) with check (true);

drop policy if exists "anon insert events" on visitor_events;
create policy "anon insert events" on visitor_events
  for insert to anon with check (true);

drop policy if exists "anon insert leads" on leads;
create policy "anon insert leads" on leads
  for insert to anon with check (true);

drop policy if exists "anon insert bookings" on bookings;
create policy "anon insert bookings" on bookings
  for insert to anon with check (true);
