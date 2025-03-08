import { db, schema } from '@avelin/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { anonymous, createAuthMiddleware } from 'better-auth/plugins'

const APP_URL = (process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL) as string
const API_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string
const BASE_DOMAIN = (process.env.BASE_DOMAIN ||
  process.env.NEXT_PUBLIC_BASE_DOMAIN) as string

console.log('APP_URL', APP_URL)

export const auth = betterAuth({
  trustedOrigins: [APP_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),
  baseURL: `${API_URL}/auth`,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    anonymous({
      emailDomainName: 'anon.avelin.app',
    }),
    nextCookies(),
  ],
  user: {
    fields: {
      image: schema.users.picture.name,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/callback/google')) {
        console.log('hellooo')
      }
    }),
  },
  advanced: {
    cookiePrefix: 'avelin',
    generateId: false,
    crossSubDomainCookies: {
      enabled: true,
      // Leading period to make the cookie accessible across al subdomains.
      domain: `.${BASE_DOMAIN}`,
    },
  },
})
