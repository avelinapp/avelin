// import { validateSession } from '@avelin/auth'
import { Logger } from '@hocuspocus/extension-logger'
import { Hocuspocus } from '@hocuspocus/server'

const server = new Hocuspocus({
  port: 4100,
  extensions: [new Logger()],
  // async onConnect(data) {
  //   console.log('Connected')
  //   console.log('Requires auth:', data.connection.requiresAuthentication)
  //   console.log('Is authenticated:', data.connection.isAuthenticated)
  //
  //   const { requiresAuthentication, isAuthenticated } = data.connection
  //   console.log('context:', data.context.session)
  //
  //   if (requiresAuthentication && !isAuthenticated) {
  //     throw new Error('Terminating connection due to missing authentication.')
  //   }
  // },
  // async onConnect(data) {
  //   data.connection.requiresAuthentication = true
  //   console.log('Connected')
  //   console.log('Connected auth:', data.context.auth)
  // },
  // async onAuthenticate(data) {
  //   console.log('here!')
  //   const { token: sessionId } = data
  //   console.log('Session ID:', sessionId)
  //   const auth = await validateSession(sessionId)
  //
  //   console.log('Auth:', auth)
  //
  //   if (!auth) {
  //     throw new Error('Invalid session.')
  //   }
  //
  //   console.log('Authenticated!')
  //
  //   return auth
  // },
})

server.listen()
