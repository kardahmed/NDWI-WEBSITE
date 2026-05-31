import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2A2A2A',
        },
        bone: {
          DEFAULT: '#F5F2EE',
          50: '#FAF8F5',
          100: '#F5F2EE',
          200: '#E8E0D5',
        },
        copper: {
          DEFAULT: '#B8651A',
          50: '#FBF1E6',
          100: '#F2D9BA',
          400: '#D08438',
          500: '#B8651A',
          600: '#985015',
          700: '#783F11',
        },
        steel: {
          DEFAULT: '#4A4A4A',
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#3A3A3A',
        },
        // ─── NOUVEAU : palette algérienne secondaire ──────────────────
        /** Cuir naturel — accent chaleureux pour blocs marketing,
         *  pieds de cards premium, ornements. Plus doux que copper. */
        cuir: {
          DEFAULT: '#A07050',
          50: '#F7EFE6',
          100: '#EBD9C6',
          400: '#B8866A',
          500: '#A07050',
          600: '#825A3D',
          700: '#5E4029',
        },
        /** Bleu Bou Saâda — référence aux artisans bleus du Sud algérien.
         *  Accent contrastant pour CTAs ponctuels ou états actifs subtils. */
        bousaada: {
          DEFAULT: '#2A4A6E',
          50: '#E8EDF3',
          100: '#C5D2E0',
          400: '#4A6A8E',
          500: '#2A4A6E',
          600: '#1F3854',
          700: '#15263A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Noto Naskh Arabic', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
      },
      maxWidth: {
        container: '1440px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      // ─── NOUVEAU : ombres premium stratifiées ──────────────────────
      boxShadow: {
        'card': '0 1px 2px 0 rgb(10 10 10 / 0.04), 0 4px 16px -2px rgb(10 10 10 / 0.05)',
        'card-hover': '0 4px 8px -2px rgb(10 10 10 / 0.06), 0 16px 32px -8px rgb(10 10 10 / 0.12)',
        'inner-soft': 'inset 0 1px 2px 0 rgb(10 10 10 / 0.05)',
      },
      // ─── NOUVEAU : motifs zellige géométrique en background-image ────
      backgroundImage: {
        // Étoile zellige discrète — inspirée des mosaïques algériennes/maghrébines.
        // Pattern 60×60, opacité 4%. Idéal en overlay sur fond bone.
        'zellige': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%23B8651A' fill-opacity='0.04' d='M30 0l8.66 21.34L60 30l-21.34 8.66L30 60l-8.66-21.34L0 30l21.34-8.66z'/%3E%3C/svg%3E\")",
        // Trame bois subtile pour fonds neutres
        'wood-grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='4' viewBox='0 0 100 4'%3E%3Cpath fill='%230A0A0A' fill-opacity='0.025' d='M0 0h100v1H0zM0 2h60v1H0z'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
};

export default config;
