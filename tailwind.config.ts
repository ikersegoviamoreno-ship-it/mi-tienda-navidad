import type { Config } from 'tailwindcss';

/**
 * Paleta Reno Aura — Navidad minimalista.
 * - snow / mist: base marfil cálida (calma, premium, deja respirar al producto)
 * - ink: texto casi negro cálido (legibilidad AA+)
 * - pine: verde abeto (confianza, marca, elementos informativos)
 * - berry: rojo baya (acción/urgencia → SOLO CTAs y precios de oferta)
 * - gold: oro apagado (detalles premium, estrellas, con moderación)
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        snow: '#FAF7F2',
        mist: '#F1ECE3',
        line: '#E3DCD0',
        ink: { DEFAULT: '#1C1A17', soft: '#5B554C' },
        pine: { DEFAULT: '#1F3D2B', light: '#2E5A40', tint: '#E6EDE8' },
        berry: { DEFAULT: '#B3261E', dark: '#8F1D17', tint: '#F8E7E5' },
        gold: { DEFAULT: '#C8A24A', tint: '#F5EDD8' }
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
