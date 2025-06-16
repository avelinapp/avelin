import {
  Button,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

export default function WaitlistInviteEmail() {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              'gray-1': '#fcfcfc',
              'gray-2': '#f9f9f9',
              'gray-3': '#f0f0f0',
              'gray-4': '#e8e8e8',
              'gray-5': '#e0e0e0',
              'gray-6': '#d9d9d9',
              'gray-7': '#cecece',
              'gray-8': '#bbbbbb',
              'gray-9': '#8d8d8d',
              'gray-10': '#838383',
              'gray-11': '#646464',
              'gray-12': '#202020',
            },
          },
        },
      }}
    >
      <Html lang="en">
        <Preview>You've been invited to the Avelin private alpha.</Preview>
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: 'https://fonts.gstatic.com/s/inter/v19/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
              format: 'woff2',
            }}
          />
        </Head>
        <Container className="font-sans text-gray-12 max-w-full bg-gray-2 pt-4">
          <Section className="pt-16 pb-4 max-w-[600px] bg-white px-4 rounded-2xl">
            <Img
              src="https://static.avelin.app/avelin-logo-text-dark.png"
              alt="Avelin"
              style={{
                display: 'block', // remove any inline-gap
                width: '50%', // fill its container
                height: 'auto', // preserve aspect ratio
                maxWidth: '600px', // optional “email max-width”
                margin: '0 auto', // center if container is wider
              }}
            />
            <Section className="mt-8">
              <Text>Hey there!</Text>
              <Text>You're in. Welcome to the Avelin private alpha.</Text>
              <Text>
                I'm Kian, the founder & developer. I've been working on this
                project for a while now, and I'm super excited to share it with
                you.
              </Text>
              <Button
                href="https://avelin.app/login"
                className="px-4 py-2.5 bg-gray-12 text-gray-1 select-none gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-gray-1 transition-[box-shadow,background-color,color] duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-5 focus-visible:ring-offset-2 my-2 mx-auto"
              >
                Join Avelin now
              </Button>
              <Text>
                When you get the chance, hop into our{' '}
                <Link
                  href="https://go.avelin.app/discord"
                  className="underline underline-blue-500 underline-offset-2"
                >
                  Discord
                </Link>{' '}
                to chat with other early users. This will be where I'll be
                sharing updates and sneak peeks of what's coming next. I'll also
                be asking for your feedback and leaning on early users like you
                to help shape the product.
              </Text>
              <Text>
                No pressure, but if you have thoughts, ideas, or run into any
                bugs or unexpected behaviour, I’d love to hear them – feel free
                to ping me on Discord :)
              </Text>
              <Text>
                Thank you for being part of our early community. Looking forward
                to chatting with you soon.
              </Text>
              <Text>Cheers,</Text>
              <Text>Kian from the Avelin / Bazza Labs crew ☕</Text>
              <Img
                src="https://static.avelin.app/kian-signature-dark.png"
                alt="Kian Bazarjani"
                className="pt-2"
                style={{
                  display: 'block', // remove any inline-gap
                  width: '40%', // fill its container
                  height: 'auto', // preserve aspect ratio
                  maxWidth: '600px', // optional “email max-width”
                  // margin: '0 auto', // center if container is wider
                }}
              />
              <Text>
                <i className="text-gray-10">P.S. - Kian rhymes with "neon"</i>
              </Text>
            </Section>
          </Section>
        </Container>

        <Container className="font-sans text-gray-12 bg-gray-2 max-w-full">
          <Section className="max-w-[600px] pt-8 pb-4 px-4">
            <Img
              src="https://static.avelin.app/bazzalabs-logo-text-dark.png"
              alt="Bazza Labs"
              style={{
                display: 'block', // remove any inline-gap
                width: '50%', // fill its container
                height: 'auto', // preserve aspect ratio
                maxWidth: '600px', // optional “email max-width”
                marginLeft: '-18px !important',
                // margin: '0 auto', // center if container is wider
              }}
            />
            <Text className="text-gray-10 text-sm">
              © 2025 Bazza Labs Inc.
              <br />
              Avelin is a product of Bazza Labs. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Html>
    </Tailwind>
  )
}
