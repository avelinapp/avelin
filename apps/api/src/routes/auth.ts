import { auth as betterAuth } from '@avelin/auth'
import { Elysia } from 'elysia'

export const auth = new Elysia().mount(betterAuth.handler).macro({
  auth: {
    async resolve({ error, request: { headers } }) {
      const data = await betterAuth.api.getSession({
        headers,
      })

      if (!data) return error(401)

      return {
        user: data.user,
        session: data.session,
      }
    },
  },
})
