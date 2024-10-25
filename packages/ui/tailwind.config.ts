import { fontFamily } from 'tailwindcss/defaultTheme'
import tailwindCssAnimate from 'tailwindcss-animate'
import { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        gray: {
          1: 'hsl(var(--gray-1))',
          2: 'hsl(var(--gray-2))',
          3: 'hsl(var(--gray-3))',
          4: 'hsl(var(--gray-4))',
          5: 'hsl(var(--gray-5))',
          6: 'hsl(var(--gray-6))',
          7: 'hsl(var(--gray-7))',
          8: 'hsl(var(--gray-8))',
          9: 'hsl(var(--gray-9))',
          10: 'hsl(var(--gray-10))',
          11: 'hsl(var(--gray-11))',
          12: 'hsl(var(--gray-12))',
        },
        // Semantic Color Variables
        'color-background': 'hsl(var(--color-background))',
        'color-text': 'hsl(var(--color-text))',
        'color-text-accent': 'hsl(var(--color-text-accent))',
        'color-border-subtle': 'hsl(var(--color-border-subtle))',
        'color-border': 'hsl(var(--color-border-normal))',
        'color-border-strong': 'hsl(var(--color-border-strong))',
        // Buttons
        primary: {
          bg: 'hsl(var(--color-primary-bg))',
          hover: 'hsl(var(--color-primary-hover))',
          active: 'hsl(var(--color-primary-active))',
          text: 'hsl(var(--color-primary-text))',
        },
        secondary: {
          bg: 'hsl(var(--color-secondary-bg))',
          hover: 'hsl(var(--color-secondary-hover))',
          active: 'hsl(var(--color-secondary-active))',
          text: 'hsl(var(--color-secondary-text))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindCssAnimate],
} satisfies Config
