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
        // ---- MilaKnight brand: charcoal canvas, vivid orange-red, white ----
        bg: {
          DEFAULT: '#1A1A1A',
          deep: '#121212',
          card: '#222222',
          elevated: '#2A2A2A'
        },
        ink: {
          DEFAULT: '#FFFFFF',
          muted: '#B3B3B3',
          dim: '#7A7A7A'
        },
        accent: {
          // Primary brand orange-red (sampled from the logo: #FF3200)
          DEFAULT: '#FF3200',
          light: '#FF5A2E',
          deep: '#C82D08',
          // legacy aliases kept so existing class names map onto the brand
          gold: '#FF8A3D',
          cyan: '#FF5A2E',
          red: '#FF3B30',
          orange: '#FF8A3D',
          green: '#2ED16A'
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          glow: 'rgba(255,50,0,0.40)'
        }
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-cairo)', 'sans-serif'],
        gothic: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace']
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255,50,0,0.50)',
        'glow-gold': '0 0 40px -8px rgba(255,138,61,0.45)',
        'glow-red': '0 0 40px -8px rgba(255,59,48,0.45)',
        elevated: '0 24px 60px -20px rgba(0,0,0,0.7)'
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(ellipse at center, rgba(255,50,0,0.18), transparent 60%)',
        'radial-red':
          'radial-gradient(ellipse at center, rgba(255,59,48,0.18), transparent 60%)'
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
