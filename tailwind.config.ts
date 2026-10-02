import type { Config } from 'tailwindcss';

/**
 * Paleta Reno Aura — Navidad minimalista en blanco, negro y rojo.
 * - snow  #FFFFFF  fondo principal
 * - cream #F7F4EF  secciones alternas / decoración
 * - ink   #111111  textos, menú y fondo secundario
 * - red   #C1121F  botones, ofertas y elementos importantes (rojo = acción)
 * - red.dark #8B0000  hover, detalles y contrastes
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        snow: '#FFFFFF',
        cream: '#F7F4EF',
        line: '#E7E2DA',
        ink: { DEFAULT: '#111111', soft: '#5C5C5C' },
        red: { DEFAULT: '#C1121F', dark: '#8B0000', tint: '#FBEAEB' }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      maxWidth: { site: '1200px' },
      keyframes: {
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } }
      },
      animation: {
        'slide-in': 'slide-in .3s cubic-bezier(.2,.8,.2,1)',
        'fade-up': 'fade-up .5s ease-out both',
        marquee: 'marquee 30s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
