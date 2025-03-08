import { db, schema } from '@avelin/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { anonymous } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),
  baseURL: `${process.env.API_URL}/auth`,
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
  ],
  user: {
    fields: {
      image: schema.users.picture.name,
    },
  },
  advanced: {
    generateId: false,
    crossSubDomainCookies: {
      enabled: true,
      // Leading period to make the cookie accessible across al subdomains.
      domain: `.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`,
    },
  },
})
