import { db, schema } from '@avelin/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),
  user: {
    fields: {
      image: schema.users.picture.name,
    },
  },
  advanced: {
    generateId: false,
  },
})
