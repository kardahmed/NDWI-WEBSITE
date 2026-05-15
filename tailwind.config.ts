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
      },
      maxWidth: {
        container: '1440px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
};

export default config;
