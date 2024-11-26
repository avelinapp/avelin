import { editor } from 'monaco-editor'
import { gray } from '@avelin/ui/colors'

export const themes: Record<'dark' | 'light', editor.IStandaloneThemeData> = {
  dark: {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#08090A',
    },
  },
  light: {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': gray.gray1,
    },
  },
} as const
