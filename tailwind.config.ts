import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx,json}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05070D',
          deep: '#02030A',
          card: '#0A0E1A',
          elevated: '#0F1424'
        },
        ink: {
          DEFAULT: '#F5F7FB',
          muted: '#A6ADBB',
          dim: '#6B7280'
        },
        accent: {
          DEFAULT: '#00D1FF',
          gold: '#E6B450',
          cyan: '#22D3EE',
          red: '#FF3B57',
          orange: '#FF8A3D',
          green: '#10B981'
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          glow: 'rgba(0,209,255,0.35)'
        }
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        display: ['var(--font-rakkas)', 'serif'],
        gothic: ['var(--font-cinzel)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace']
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(0,209,255,0.45)',
        'glow-gold': '0 0 40px -8px rgba(230,180,80,0.45)',
        'glow-red': '0 0 40px -8px rgba(255,59,87,0.45)',
        elevated: '0 24px 60px -20px rgba(0,0,0,0.7)'
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(ellipse at center, rgba(0,209,255,0.18), transparent 60%)',
        'radial-red':
          'radial-gradient(ellipse at center, rgba(255,59,87,0.18), transparent 60%)'
      },
      backgroundSize: {
        grid: '32px 32px'
      },
      keyframes: {
        'pulse-soft': {
          '0%,100%': { opacity: '0.65' },
          '50%': { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        scan: 'scan 3s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
