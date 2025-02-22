import type { PluginAPI } from 'tailwindcss/types/config'

export default ({ matchUtilities, theme }: PluginAPI) => {
  matchUtilities(
    {
      'hover-expand': (value: string) => {
        return {
          position: 'relative',
          '--hover-radius': `-${value}`, // Use a template literal to set the variable dynamically
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 'var(--hover-radius)',
            left: 'var(--hover-radius)',
            right: 'var(--hover-radius)',
            bottom: 'var(--hover-radius)',
            pointerEvents: 'auto',
          },
        }
      },
    },
    {
      // This ties the utility values to your theme’s spacing scale.
      values: theme('spacing'),
    },
  )

  matchUtilities(
    {
      'hover-expand-container': (value: string) => ({
        position: 'relative',
        '--hover-radius': `-${value}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 'var(--hover-radius)',
          left: 'var(--hover-radius)',
          right: 'var(--hover-radius)',
          bottom: 'var(--hover-radius)',
          zIndex: '0',
          // Set to auto so the pseudo–element can capture hover events when outside the inner area.
          pointerEvents: 'auto',
        },
        // This allows you to style the container when its expanded area is hovered.
        '&:hover': {
          // For example, you might add a background change:
          // backgroundColor: 'rgba(0,0,0,0.05)',
        },
      }),
    },
    {
      values: theme('spacing'),
    },
  )

  // Utility for the inner element to ensure its hover state takes precedence.
  // This class should be added to the element that is a child of the container.
  matchUtilities(
    {
      'hover-expand-inner': () => ({
        position: 'relative',
        zIndex: '10', // Ensure this sits above the container's pseudo–element.
        // Allow pointer events to reach the inner element.
        pointerEvents: 'auto',
        // You can style the element's own hover state directly.
        '&:hover': {
          // e.g., change text color when directly hovered.
          // color: 'white',
        },
      }),
    },
    {
      values: { default: 'default' },
    },
  )
}
