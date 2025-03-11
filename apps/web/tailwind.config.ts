import { default as baseConfig } from '@avelin/ui/tailwind'
import type { Config } from 'tailwindcss'

export default {
  presets: [baseConfig],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable'],
        mono: ['var(--font-berkeley-mono)'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        lg: [
          '1.125rem',
          { lineHeight: '1.75rem', letterSpacing: '-0.01575em' },
        ],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01575em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01575em' }],
        '3xl': [
          '1.875rem',
          { lineHeight: '2.25rem', letterSpacing: '-0.01575em' },
        ],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
    },
  },
} satisfies Config
