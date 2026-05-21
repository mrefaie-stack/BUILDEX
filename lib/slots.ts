/**
 * Server-side meeting slot generator.
 *
 * - Generates slots for the next 14 days
 * - Workdays only (Sat-Wed for Syrian business; configurable)
 * - 30-minute slots between 10:00 and 18:00 (Asia/Damascus assumed)
 * - Skips slots already in the past
 *
 * The generator is pure (no DB): the API route subtracts already-booked
 * timestamps from this list. This keeps the picker logic dead-simple in
 * the browser and free of timezone bugs.
 */

export const SLOT_TZ = 'Asia/Damascus';
export const SLOT_DURATION_MIN = 45;
export const SLOT_GRID_MIN = 30;
export const SLOT_HOUR_START = 10;
export const SLOT_HOUR_END = 18;
export const SLOT_LOOKAHEAD_DAYS = 14;
// Workdays — 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat (JS Date convention).
// Syrian standard: open Sat-Thu, closed Friday.
export const WORK_DAYS = new Set([0, 1, 2, 3, 4, 6]);

export interface SlotDay {
  date: string; // YYYY-MM-DD (in SLOT_TZ)
  label: string; // human label
  weekdayLabel: string;
  slots: Slot[];
}

export interface Slot {
  startIso: string; // UTC ISO string (what we store)
  label: string; // "10:00"
  available: boolean;
}

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Build a UTC ISO timestamp for the given local (Damascus) date+time.
 * Syria is UTC+3 (standard) or UTC+3 (no DST since 2022). We hardcode +3.
 */
function localDamascusToUtc(
  year: number,
  month1: number,
  day: number,
  hour: number,
  minute: number
): Date {
  // Damascus is UTC+3 year-round (Syria abolished DST in 2022-10).
  // Convert local clock time to UTC by subtracting 3h.
  return new Date(Date.UTC(year, month1 - 1, day, hour - 3, minute));
}

interface YMD {
  y: number;
  m: number;
  d: number;
  weekday: number;
}

/** Today's date in the Damascus calendar. */
function damascusToday(): YMD {
  const now = new Date();
  const damascus = new Date(now.getTime() + 3 * 3600 * 1000); // shift to +3
  return {
    y: damascus.getUTCFullYear(),
    m: damascus.getUTCMonth() + 1,
    d: damascus.getUTCDate(),
    weekday: damascus.getUTCDay()
  };
}

function addDays(base: YMD, n: number): YMD {
  const d = new Date(Date.UTC(base.y, base.m - 1, base.d));
  d.setUTCDate(d.getUTCDate() + n);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth() + 1,
    d: d.getUTCDate(),
    weekday: d.getUTCDay()
  };
}

export function generateSlots(takenIso: Set<string> = new Set()): SlotDay[] {
  const today = damascusToday();
  const now = Date.now();
  const days: SlotDay[] = [];

  for (let offset = 0; offset < SLOT_LOOKAHEAD_DAYS; offset++) {
    const d = addDays(today, offset);
    if (!WORK_DAYS.has(d.weekday)) continue;

    const slots: Slot[] = [];
    for (let h = SLOT_HOUR_START; h < SLOT_HOUR_END; h++) {
      for (let m = 0; m < 60; m += SLOT_GRID_MIN) {
        const utc = localDamascusToUtc(d.y, d.m, d.d, h, m);
        const startMs = utc.getTime();
        // Skip past slots (allow only those at least 2h in the future)
        if (startMs < now + 2 * 3600 * 1000) continue;
        const startIso = utc.toISOString();
        slots.push({
          startIso,
          label: `${pad(h)}:${pad(m)}`,
          available: !takenIso.has(startIso)
        });
      }
    }
    if (slots.length === 0) continue;

    days.push({
      date: `${d.y}-${pad(d.m)}-${pad(d.d)}`,
      label: `${pad(d.d)}/${pad(d.m)}`,
      weekdayLabel: ARABIC_WEEKDAYS[d.weekday],
      slots
    });
  }
  return days;
}

/**
 * Format an ISO timestamp into "السبت 22/05 · 14:30" for display.
 */
export function formatSlotLabel(iso: string): string {
  const d = new Date(iso);
  // Convert to Damascus local time for display
  const dam = new Date(d.getTime() + 3 * 3600 * 1000);
  const weekday = ARABIC_WEEKDAYS[dam.getUTCDay()];
  const dd = pad(dam.getUTCDate());
  const mm = pad(dam.getUTCMonth() + 1);
  const hh = pad(dam.getUTCHours());
  const mi = pad(dam.getUTCMinutes());
  return `${weekday} ${dd}/${mm} · ${hh}:${mi}`;
}
