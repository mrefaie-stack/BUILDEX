'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * Cinematic backdrop for the Gate page:
 *  - Deep gradient vignette
 *  - Slow-drifting smoke (CSS noise)
 *  - Falling-up embers (canvas)
 *  - Vertical light shaft (CSS)
 *  - Sword beam center line that pulses
 *
 * Designed to layer behind the gate copy.
 */
export function HeroAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = (canvas.width = window.innerWidth * dpr);
    let h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);

    const onResize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize);

    interface Ember {
      x: number;
      y: number;
      vy: number;
      vx: number;
      r: number;
      life: number;
      decay: number;
      hue: number;
    }
    const embers: Ember[] = [];
    const SPAWN_RATE = reduce ? 0 : 0.6;

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // Spawn embers from bottom
      if (Math.random() < SPAWN_RATE) {
        embers.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          vy: -0.4 - Math.random() * 1.2,
          vx: (Math.random() - 0.5) * 0.3,
          r: 0.8 + Math.random() * 1.6,
          life: 1,
          decay: 0.003 + Math.random() * 0.004,
          hue: Math.random() < 0.65 ? 28 : 195 // warm or cyan
        });
      }

      for (const e of embers) {
        e.x += e.vx;
        e.y += e.vy;
        e.life -= e.decay;
        if (e.life <= 0) continue;
        const a = Math.max(0, e.life);
        ctx.beginPath();
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
        grad.addColorStop(0, `hsla(${e.hue}, 90%, 70%, ${a * 0.9})`);
        grad.addColorStop(1, `hsla(${e.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${e.hue}, 100%, 80%, ${a})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // GC
      for (let i = embers.length - 1; i >= 0; i--) {
        if (embers[i].life <= 0 || embers[i].y < -20) embers.splice(i, 1);
      }

      if (!reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 90% at 50% 30%, rgba(0,209,255,0.10), transparent 60%), radial-gradient(ellipse 100% 100% at 50% 110%, rgba(255,138,61,0.06), transparent 60%), linear-gradient(180deg, #02030A 0%, #05070D 50%, #02030A 100%)'
        }}
      />

      {/* Vertical light shaft from above */}
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-0 h-[70vh] w-[40vw] -translate-x-1/2 blur-3xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,209,255,0.20) 0%, rgba(0,209,255,0.05) 60%, transparent 100%)'
        }}
      />

      {/* Smoke layer (noise + slow drift) */}
      <motion.div
        animate={{ x: ['-2%', '2%', '-2%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.6  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '900px 900px'
        }}
      />

      {/* Sword beam — vertical center line that pulses */}
      <motion.div
        initial={{ opacity: 0.35, scaleY: 0.6 }}
        animate={{ opacity: [0.35, 0.85, 0.35], scaleY: [0.6, 1, 0.6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-[12%] h-[60%] w-[2px] -translate-x-1/2 origin-top blur-[1px]"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,209,255,0.0) 5%, rgba(0,209,255,0.95) 50%, rgba(0,209,255,0.0) 95%)',
          boxShadow: '0 0 24px rgba(0,209,255,0.65)'
        }}
      />

      {/* Ember canvas on top */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
