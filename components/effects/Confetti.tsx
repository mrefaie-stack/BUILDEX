'use client';

import { useEffect, useRef } from 'react';

interface BurstOptions {
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  spread?: number;
  power?: number;
}

const DEFAULTS: Required<Pick<BurstOptions, 'count' | 'colors' | 'spread' | 'power'>> = {
  count: 90,
  colors: ['#00D1FF', '#E6B450', '#FFFFFF', '#FF8A3D'],
  spread: 70,
  power: 9
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let raf = 0;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number; // 0..1, decays
  shape: 'sq' | 'cr';
}

function ensureCanvas() {
  if (typeof window === 'undefined') return false;
  if (canvas) return true;
  canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  };
  resize();
  window.addEventListener('resize', resize);
  ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return true;
}

function loop() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.vy += 0.18; // gravity
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;
    p.life -= 0.012;
    if (p.life <= 0) continue;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    if (p.shape === 'sq') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  particles = particles.filter((p) => p.life > 0);
  if (particles.length > 0) {
    raf = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

export function burstConfetti(opts: BurstOptions) {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  if (!ensureCanvas()) return;
  const { count, colors, spread, power } = { ...DEFAULTS, ...opts };
  for (let i = 0; i < count; i++) {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (spread * Math.PI) / 180;
    const speed = power * (0.6 + Math.random() * 0.8);
    particles.push({
      x: opts.x,
      y: opts.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
      shape: Math.random() > 0.4 ? 'sq' : 'cr'
    });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}

/**
 * Convenience helper — burst at the center of the screen.
 */
export function burstAtCenter(opts: Partial<BurstOptions> = {}) {
  burstConfetti({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 - 80,
    ...opts
  });
}

/**
 * Convenience helper — burst at the location of an event target.
 */
export function burstAtElement(el: Element, opts: Partial<BurstOptions> = {}) {
  const r = el.getBoundingClientRect();
  burstConfetti({
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    ...opts
  });
}

/**
 * (Compat) Hidden root component — keeps a stable mount target for SSR.
 * Not strictly needed since we createElement lazily, but exported in case
 * a parent wants to ensure availability before any burst.
 */
export function ConfettiRoot() {
  const r = useRef(false);
  useEffect(() => {
    if (r.current) return;
    r.current = true;
    ensureCanvas();
  }, []);
  return null;
}
