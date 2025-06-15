import { db, schema } from '@avelin/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
  type JwtOptions,
  anonymous,
  bearer,
  createAuthMiddleware,
  customSession,
  getJwtToken,
  jwt,
  openAPI,
} from 'better-auth/plugins'

const APP_URL = (process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL) as string
const API_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string
const BASE_DOMAIN = (process.env.BASE_DOMAIN ||
  process.env.NEXT_PUBLIC_BASE_DOMAIN) as string

export type User = typeof auth.$Infer.Session.user
export type Session = typeof auth.$Infer.Session.session

const jwtOptions = {
  jwt: {
    expirationTime: '1d',
  },
} as const satisfies JwtOptions

export const auth = betterAuth({
  trustedOrigins: [APP_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verifications,
      jwks: schema.jwks,
    },
  }),
  baseURL: `${API_URL}/auth`,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    bearer(),
    anonymous({
      emailDomainName: 'anon.avelin.app',
    }),
    jwt(jwtOptions),
    openAPI(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    fields: {
      image: schema.users.picture.name,
    },
    additionalFields: {
      isAdminUser: {
        type: 'boolean',
      },
    },
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/callback')) {
        ctx.context.session = ctx.context.newSession
        const jwt = await getJwtToken(ctx, jwtOptions)
        console.log('[Auth] JWT:', jwt)
        ctx.setCookie('avelin.session_jwt', jwt, {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          domain: `.${BASE_DOMAIN}`,
          maxAge: 60 * 60 * 24, // 24h
        })
      }
    }),
  },
})

export const authCookies = (await auth.$context).authCookies
