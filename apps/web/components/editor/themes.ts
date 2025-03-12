import { gray } from '@avelin/ui/colors'
import type { editor } from 'monaco-editor'
import type { ThemeRegistration } from 'shiki'
import avelinDarkTheme from './themes/avelin-dark.json'
import avelinLightTheme from './themes/avelin-light.json'

export const avelinDark = {
  ...avelinDarkTheme,
} as ThemeRegistration

export const avelinLight = {
  ...avelinLightTheme,
} as ThemeRegistration

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
