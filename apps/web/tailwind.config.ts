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
        sans: ['InnovatorGrotesk'],
        mono: ['var(--font-jetbrains-mono)'],
      },
    },
  },
} satisfies Config
