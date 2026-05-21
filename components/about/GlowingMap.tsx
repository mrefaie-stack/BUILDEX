'use client';

import { motion } from 'framer-motion';
import cities from '@/data/cities.json';

export function GlowingMap() {
  return (
    <div className="relative aspect-[4/3] w-full surface rounded-2xl p-4 overflow-hidden">
      {/* Stylized syria map */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="bgFill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(0,209,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E6B450" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgFill)" />
        {/* simplified outline of Syria */}
        <path
          d="M14,28 L24,22 L36,18 L48,15 L60,18 L72,22 L84,28 L86,40 L82,52 L78,62 L72,72 L60,80 L48,84 L36,82 L24,76 L18,68 L12,56 L14,42 Z"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(0,209,255,0.25)"
          strokeWidth="0.4"
        />

        {/* connection lines between pins */}
        {cities.slice(0, -1).map((c, i) => {
          const next = cities[i + 1];
          return (
            <motion.line
              key={c.id}
              x1={c.x}
              y1={c.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#lineG)"
              strokeWidth="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: i * 0.1 }}
            />
          );
        })}

        {/* pins */}
        {cities.map((c, i) => (
          <g key={c.id}>
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={3}
              fill="rgba(0,209,255,0.18)"
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.6, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
            />
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={0.9}
              fill="#00D1FF"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
            />
            <motion.text
              x={c.x + 2}
              y={c.y - 1.5}
              fontSize="2.2"
              fill="rgba(255,255,255,0.85)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
            >
              {c.name}
            </motion.text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widest text-ink-dim">
        SYRIA_MAP / OPERATIONAL_ZONES
      </div>
    </div>
  );
}
