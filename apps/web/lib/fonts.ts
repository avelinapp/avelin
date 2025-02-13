import { JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const innovatorGrotesk = localFont({
  display: 'block',
  variable: '--font-innovator-grotesk',
  src: '../static/fonts/innovator-grotesk/InnovatorGrotesk-Variable.woff2',
})

export const berkeleyMono = localFont({
  display: 'block',
  variable: '--font-berkeley-mono',
  src: [
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../static/fonts/berkeley-mono/BerkeleyMono-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
})
