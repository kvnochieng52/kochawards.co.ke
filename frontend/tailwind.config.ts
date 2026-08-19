import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effef6',
          100: '#d8ffe9',
          200: '#b3fdd4',
          300: '#78f8b4',
          400: '#37ea8b',
          500: '#0fd06a',
          600: '#04a955',
          700: '#068547',
          800: '#0a693c',
          900: '#0a5634',
          950: '#00301a',
        },
        accent: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        ink: {
          950: '#080b12',
          900: '#0d1220',
          800: '#141a2b',
          700: '#1c2338',
          600: '#2a3350',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'brand-radial':
          'radial-gradient(circle at 30% 20%, rgba(15,208,106,0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.28), transparent 50%)',
      },
      boxShadow: {
        glow: '0 20px 60px -20px rgba(15,208,106,0.45)',
        card: '0 20px 45px -25px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
