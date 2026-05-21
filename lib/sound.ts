'use client';

/**
 * Lightweight cinematic synth.
 *  - No audio assets shipped — every sound is generated with Web Audio.
 *  - Respects user mute preference (persisted in localStorage).
 *  - Browser autoplay-safe: AudioContext is created lazily on first user
 *    interaction; before that, every play() call is a no-op.
 */

const STORE_KEY = 'milaknight:sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

type SoundName =
  | 'tick'
  | 'click'
  | 'select'
  | 'confirm'
  | 'success'
  | 'warn'
  | 'deny'
  | 'whoosh'
  | 'charge'
  | 'open'
  | 'hover';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORE_KEY) !== 'off';
}

export function setSoundEnabled(on: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, on ? 'on' : 'off');
  if (master && ctx) master.gain.value = on ? 0.18 : 0;
}

function ensureCtx(): boolean {
  if (typeof window === 'undefined') return false;
  if (!ctx) {
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = isSoundEnabled() ? 0.18 : 0;
      master.connect(ctx.destination);
    } catch {
      return false;
    }
  }
  // Resume if autoplay policy suspended it (must be inside a user gesture).
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return true;
}

/** Call once on first user gesture to unlock audio. */
export function unlockSound() {
  ensureCtx();
}

interface ToneSpec {
  freq: number;
  duration: number;
  type?: OscillatorType;
  startGain?: number;
  endGain?: number;
  glide?: number; // optional pitch glide to this freq
  delay?: number;
  filter?: { type: BiquadFilterType; freq: number; q?: number };
}

function playTone({
  freq,
  duration,
  type = 'sine',
  startGain = 1,
  endGain = 0.0001,
  glide,
  delay = 0,
  filter
}: ToneSpec) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, glide),
      t0 + duration
    );
  }
  g.gain.setValueAtTime(startGain, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.00001, endGain), t0 + duration);

  let node: AudioNode = osc;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type;
    f.frequency.value = filter.freq;
    if (filter.q !== undefined) f.Q.value = filter.q;
    osc.connect(f);
    node = f;
  }
  node.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function playNoise({
  duration,
  startGain = 0.8,
  endGain = 0.0001,
  filterFreq = 2000,
  filterQ = 1,
  filterType = 'bandpass' as BiquadFilterType,
  delay = 0
}: {
  duration: number;
  startGain?: number;
  endGain?: number;
  filterFreq?: number;
  filterQ?: number;
  filterType?: BiquadFilterType;
  delay?: number;
}) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + delay;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = filterFreq;
  f.Q.value = filterQ;
  const g = ctx.createGain();
  g.gain.setValueAtTime(startGain, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.00001, endGain), t0 + duration);
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
}

const RECIPES: Record<SoundName, () => void> = {
  // Soft UI tick — for arsenal toggle, etc.
  tick: () =>
    playTone({
      freq: 1400,
      glide: 1800,
      duration: 0.05,
      type: 'square',
      startGain: 0.25
    }),

  // Generic crisp click — buttons.
  click: () => {
    playTone({ freq: 900, glide: 1200, duration: 0.06, type: 'triangle', startGain: 0.35 });
    playNoise({ duration: 0.04, startGain: 0.12, filterFreq: 3000, filterQ: 1.5 });
  },

  // Selection — a metallic confirm chime.
  select: () => {
    playTone({ freq: 660, duration: 0.12, type: 'triangle', startGain: 0.5 });
    playTone({ freq: 990, duration: 0.18, type: 'sine', startGain: 0.35, delay: 0.04 });
  },

  // Confirm — fuller two-note up.
  confirm: () => {
    playTone({ freq: 523.25, duration: 0.18, type: 'triangle', startGain: 0.5 });
    playTone({ freq: 783.99, duration: 0.32, type: 'triangle', startGain: 0.45, delay: 0.12 });
  },

  // Success — fanfare-y arpeggio.
  success: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      playTone({
        freq: f,
        duration: 0.3,
        type: 'triangle',
        startGain: 0.5 - i * 0.06,
        delay: i * 0.07
      })
    );
    playNoise({ duration: 0.5, startGain: 0.06, filterFreq: 6000, filterQ: 0.7, delay: 0.1 });
  },

  // Warning — urgent two-note descend.
  warn: () => {
    playTone({ freq: 880, duration: 0.18, type: 'square', startGain: 0.4 });
    playTone({ freq: 740, duration: 0.22, type: 'square', startGain: 0.35, delay: 0.16 });
  },

  // Negative / deny.
  deny: () => {
    playTone({ freq: 220, glide: 110, duration: 0.28, type: 'sawtooth', startGain: 0.35 });
  },

  // Whoosh — page transitions.
  whoosh: () =>
    playNoise({
      duration: 0.4,
      startGain: 0.25,
      endGain: 0.001,
      filterFreq: 1800,
      filterQ: 0.6,
      filterType: 'bandpass'
    }),

  // Charging tone — for loading bar on gate.
  charge: () =>
    playTone({
      freq: 110,
      glide: 660,
      duration: 1.4,
      type: 'sawtooth',
      startGain: 0.18,
      endGain: 0.001,
      filter: { type: 'lowpass', freq: 1500, q: 1 }
    }),

  // Drawer / modal open — soft impact.
  open: () => {
    playTone({ freq: 320, glide: 220, duration: 0.18, type: 'triangle', startGain: 0.4 });
    playNoise({ duration: 0.08, startGain: 0.1, filterFreq: 1200, filterQ: 1 });
  },

  // Subtle hover hint — used sparingly.
  hover: () =>
    playTone({
      freq: 1800,
      duration: 0.04,
      type: 'sine',
      startGain: 0.08
    })
};

export function playSound(name: SoundName) {
  if (typeof window === 'undefined') return;
  if (!isSoundEnabled()) return;
  if (!ensureCtx()) return;
  try {
    RECIPES[name]();
  } catch {
    /* ignore audio errors — never crash UI */
  }
}
