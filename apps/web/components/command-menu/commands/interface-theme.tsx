import {
  ChevronRightIcon,
  ComputerIcon,
  LucideIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from '@avelin/icons'
import { cn } from '@avelin/ui/cn'
import { CommandItem, CommandItemProps } from '@avelin/ui/command'
import { toast } from '@avelin/ui/sonner'
import { useTheme } from 'next-themes'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useCallback } from 'react'

interface Props {
  closeMenu: () => void
}

type InterfaceTheme = {
  name: string
  value: 'dark' | 'light' | 'system'
  keywords?: string[]
  icon: LucideIcon
}

const themes: InterfaceTheme[] = [
  {
    name: 'Dark',
    value: 'dark',
    keywords: ['dark', 'theme'],
    icon: MoonIcon,
  },
  {
    name: 'Light',
    value: 'light',
    keywords: ['light', 'theme'],
    icon: SunIcon,
  },
  {
    name: 'System',
    value: 'system',
    keywords: ['system', 'theme'],
    icon: ComputerIcon,
  },
] as const

export function ChangeInterfaceThemeRootCommand({
  className,
  ...props
}: CommandItemProps) {
  const FF_darkMode = useFeatureFlagEnabled('theme-dark-mode')

  if (!FF_darkMode) {
    return null
  }

  return (
    <CommandItem
      {...props}
      className={cn(className)}
    >
      <SunMoonIcon />
      Change interface theme...
    </CommandItem>
  )
}

export function ChangeInterfaceThemeCommands({ closeMenu }: Props) {
  // Feature flag
  const FF_darkMode = useFeatureFlagEnabled('theme-dark-mode')

  const { setTheme } = useTheme()

  const changeTheme = useCallback(
    (themeValue: InterfaceTheme['value']) => {
      const theme = themes.find((t) => t.value === themeValue)!
      setTheme(theme.value)
      toast(`Switched to ${theme.name} theme.`, {
        icon: <theme.icon className='size-4 shrink-0' />,
        id: 'interface-theme-change',
      })
    },
    [setTheme],
  )

  if (!FF_darkMode) {
    return null
  }

  return (
    <>
      {themes.map((theme) => (
        <CommandItem
          key={theme.value}
          value={theme.value}
          keywords={theme.keywords}
          onSelect={(value) => {
            changeTheme(value as InterfaceTheme['value'])
            closeMenu()
          }}
        >
          <theme.icon />
          <span className='text-color-text-quaternary'>
            Change interface theme
          </span>
          <ChevronRightIcon className='!h-3 !w-3' />
          {theme.name}
        </CommandItem>
      ))}
    </>
  )
}
