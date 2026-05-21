'use client';

import { motion } from 'framer-motion';
import type { Battle } from '@/lib/types';

interface Props {
  battles: Battle[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function BattleMap({ battles, activeId, onSelect }: Props) {
  return (
    <div className="relative aspect-[4/3] surface rounded-2xl overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="mapFill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(0,209,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#mapFill)" />
        <path
          d="M14,28 L24,22 L36,18 L48,15 L60,18 L72,22 L84,28 L86,40 L82,52 L78,62 L72,72 L60,80 L48,84 L36,82 L24,76 L18,68 L12,56 L14,42 Z"
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(0,209,255,0.3)"
          strokeWidth="0.4"
        />

        {battles.map((b, i) => {
          const isActive = activeId === b.id;
          return (
            <g key={b.id}>
              <motion.circle
                cx={b.pin.x}
                cy={b.pin.y}
                r={isActive ? 4 : 3}
                fill={isActive ? 'rgba(230,180,80,0.25)' : 'rgba(0,209,255,0.18)'}
                animate={
                  isActive
                    ? { r: [3, 5, 3] }
                    : { r: [2.6, 3.4, 2.6] }
                }
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
              />
              <circle
                cx={b.pin.x}
                cy={b.pin.y}
                r={1.1}
                fill={isActive ? '#E6B450' : '#00D1FF'}
                onClick={() => onSelect(b.id)}
                className="cursor-pointer"
              />
              <text
                x={b.pin.x + 2.4}
                y={b.pin.y + 0.5}
                fontSize="2.4"
                fill={isActive ? '#FFE9B0' : 'rgba(255,255,255,0.85)'}
                onClick={() => onSelect(b.id)}
                className="cursor-pointer select-none"
              >
                {b.city}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widest text-ink-dim">
        BATTLE_LOG / OPERATIONS_MAP
      </div>
    </div>
  );
}
