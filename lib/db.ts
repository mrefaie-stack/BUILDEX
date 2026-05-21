import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

let _db: Database.Database | null = null;

function getDbPath(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  return path.join(process.cwd(), 'var', 'buildex.db');
}

export function getDb(): Database.Database {
  if (_db) return _db;
  const p = getDbPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const db = new Database(p);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  migrate(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id            TEXT PRIMARY KEY,
      visitor_id    TEXT UNIQUE NOT NULL,
      first_seen    TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen     TEXT NOT NULL DEFAULT (datetime('now')),
      selected_path TEXT,
      current_level TEXT,
      source        TEXT,
      user_agent    TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS visitors_last_seen_idx ON visitors(last_seen DESC);

    CREATE TABLE IF NOT EXISTS visitor_events (
      id          TEXT PRIMARY KEY,
      visitor_id  TEXT NOT NULL,
      event_name  TEXT NOT NULL,
      page        TEXT,
      metadata    TEXT, -- JSON-encoded
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS visitor_events_visitor_idx ON visitor_events(visitor_id);
    CREATE INDEX IF NOT EXISTS visitor_events_event_idx   ON visitor_events(event_name);
    CREATE INDEX IF NOT EXISTS visitor_events_created_idx ON visitor_events(created_at DESC);

    CREATE TABLE IF NOT EXISTS leads (
      id                TEXT PRIMARY KEY,
      visitor_id        TEXT,
      name              TEXT,
      phone             TEXT NOT NULL,
      city              TEXT,
      company_type      TEXT,
      selected_package  TEXT,
      selected_services TEXT, -- JSON-encoded
      calculator_result REAL,
      source            TEXT,
      message           TEXT,
      status            TEXT NOT NULL DEFAULT 'new',
      created_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS leads_status_idx  ON leads(status);
    CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS leads_visitor_idx ON leads(visitor_id);

    CREATE TABLE IF NOT EXISTS bookings (
      id                TEXT PRIMARY KEY,
      visitor_id        TEXT,
      lead_id           TEXT,
      name              TEXT,
      phone             TEXT,
      city              TEXT,
      selected_package  TEXT,
      selected_services TEXT, -- JSON-encoded
      booking_source    TEXT,
      meeting_at        TEXT, -- ISO timestamp of the chosen meeting slot
      meeting_duration  INTEGER DEFAULT 45, -- minutes
      created_at        TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS bookings_meeting_idx ON bookings(meeting_at);
    CREATE INDEX IF NOT EXISTS bookings_created_idx ON bookings(created_at DESC);
  `);
}

export function newId(): string {
  return randomUUID();
}

// ---------------- Row types ----------------
export interface VisitorRow {
  id: string;
  visitor_id: string;
  first_seen: string;
  last_seen: string;
  selected_path: string | null;
  current_level: string | null;
  source: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface VisitorEventRow {
  id: string;
  visitor_id: string;
  event_name: string;
  page: string | null;
  metadata: string | null; // JSON string
  created_at: string;
}

export interface LeadRow {
  id: string;
  visitor_id: string | null;
  name: string | null;
  phone: string;
  city: string | null;
  company_type: string | null;
  selected_package: string | null;
  selected_services: string | null; // JSON string
  calculator_result: number | null;
  source: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface BookingRow {
  id: string;
  visitor_id: string | null;
  lead_id: string | null;
  name: string | null;
  phone: string | null;
  city: string | null;
  selected_package: string | null;
  selected_services: string | null;
  booking_source: string | null;
  meeting_at: string | null;
  meeting_duration: number | null;
  created_at: string;
}

// ---------------- Helpers ----------------
export function jsonOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  try {
    return JSON.stringify(v);
  } catch {
    return null;
  }
}

export function parseJsonField<T = unknown>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

/**
 * Returns all booked meeting timestamps (ISO) that are in the future.
 * Used by the slot picker to disable already-taken slots.
 */
export function getBookedSlots(): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT meeting_at FROM bookings WHERE meeting_at IS NOT NULL AND meeting_at >= datetime('now')"
    )
    .all() as { meeting_at: string }[];
  return rows.map((r) => r.meeting_at).filter(Boolean);
}
