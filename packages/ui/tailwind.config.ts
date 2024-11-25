import { fontFamily } from 'tailwindcss/defaultTheme'
import tailwindCssAnimate from 'tailwindcss-animate'
import { Config } from 'tailwindcss'

function color(cssVar: string) {
  return `hsl(var(--${cssVar}) / <alpha-value>)`
}

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
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
          1: color('gray-1'),
          2: color('gray-2'),
          3: color('gray-3'),
          4: color('gray-4'),
          5: color('gray-5'),
          6: color('gray-6'),
          7: color('gray-7'),
          8: color('gray-8'),
          9: color('gray-9'),
          10: color('gray-10'),
          11: color('gray-11'),
          12: color('gray-12'),
        },
        red: {
          1: color('red-1'),
          2: color('red-2'),
          3: color('red-3'),
          4: color('red-4'),
          5: color('red-5'),
          6: color('red-6'),
          7: color('red-7'),
          8: color('red-8'),
          9: color('red-9'),
          10: color('red-10'),
          11: color('red-11'),
          12: color('red-12'),
        },
        orange: {
          1: color('orange-1'),
          2: color('orange-2'),
          3: color('orange-3'),
          4: color('orange-4'),
          5: color('orange-5'),
          6: color('orange-6'),
          7: color('orange-7'),
          8: color('orange-8'),
          9: color('orange-9'),
          10: color('orange-10'),
          11: color('orange-11'),
          12: color('orange-12'),
        },
        green: {
          1: color('green-1'),
          2: color('green-2'),
          3: color('green-3'),
          4: color('green-4'),
          5: color('green-5'),
          6: color('green-6'),
          7: color('green-7'),
          8: color('green-8'),
          9: color('green-9'),
          10: color('green-10'),
          11: color('green-11'),
          12: color('green-12'),
        },
        blue: {
          1: color('blue-1'),
          2: color('blue-2'),
          3: color('blue-3'),
          4: color('blue-4'),
          5: color('blue-5'),
          6: color('blue-6'),
          7: color('blue-7'),
          8: color('blue-8'),
          9: color('blue-9'),
          10: color('blue-10'),
          11: color('blue-11'),
          12: color('blue-12'),
        },
        indigo: {
          1: color('indigo-1'),
          2: color('indigo-2'),
          3: color('indigo-3'),
          4: color('indigo-4'),
          5: color('indigo-5'),
          6: color('indigo-6'),
          7: color('indigo-7'),
          8: color('indigo-8'),
          9: color('indigo-9'),
          10: color('indigo-10'),
          11: color('indigo-11'),
          12: color('indigo-12'),
        },
        purple: {
          1: color('purple-1'),
          2: color('purple-2'),
          3: color('purple-3'),
          4: color('purple-4'),
          5: color('purple-5'),
          6: color('purple-6'),
          7: color('purple-7'),
          8: color('purple-8'),
          9: color('purple-9'),
          10: color('purple-10'),
          11: color('purple-11'),
          12: color('purple-12'),
        },
        pink: {
          1: color('pink-1'),
          2: color('pink-2'),
          3: color('pink-3'),
          4: color('pink-4'),
          5: color('pink-5'),
          6: color('pink-6'),
          7: color('pink-7'),
          8: color('pink-8'),
          9: color('pink-9'),
          10: color('pink-10'),
          11: color('pink-11'),
          12: color('pink-12'),
        },
        // Semantic Color Variables
        'color-background': 'hsl(var(--color-background))',
        'color-background-2': 'hsl(var(--color-background-2))',
        // Text
        'color-text-primary': 'hsl(var(--color-text-primary))',
        'color-text-secondary': 'hsl(var(--color-text-secondary))',
        'color-text-tertiary': 'hsl(var(--color-text-tertiary))',
        'color-text-quaternary': 'hsl(var(--color-text-quaternary))',
        // Borders
        'color-border-subtle': 'hsl(var(--color-border-subtle))',
        'color-border': 'hsl(var(--color-border-normal))',
        'color-border-strong': 'hsl(var(--color-border-strong))',
        // Popover
        popover: {
          bg: 'hsl(var(--color-popover-bg))',
        },
        // Buttons
        primary: {
          bg: 'hsl(var(--color-primary-bg))',
          hover: 'hsl(var(--color-primary-hover))',
          active: 'hsl(var(--color-primary-active))',
          text: 'hsl(var(--color-primary-text))',
        },
        secondary: {
          'bg-subtle': 'hsl(var(--color-secondary-bg-subtle))',
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
