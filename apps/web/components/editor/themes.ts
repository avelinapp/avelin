import { gray } from '@avelin/ui/colors'
import type { editor } from 'monaco-editor'

export const themes: Record<'dark' | 'light', editor.IStandaloneThemeData> = {
  dark: {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#111111',
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
