import { schema as drizzleSchema } from '@avelin/database'
import { definePermissions } from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'

export const schema = createZeroSchema(drizzleSchema, {
  version: 1,
  tables: {
    users: {
      id: true,
      name: true,
      email: true,
      isAnonymous: true,
      picture: true,
      retiredAt: true,
      linkedUserId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    sessions: false,
    oauthAccounts: false,
    rooms: {
      id: true,
      slug: false,
      ydoc: false,
      title: false,
      editorLanguage: false,
      creatorId: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    },
    roomParticipants: {
      roomId: true,
      userId: true,
      lastAccessedAt: true,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    },
  },
  manyToMany: {
    rooms: {
      participants: ['roomParticipants', 'users'],
    },
  },
})

// const rooms = table('rooms')
//   .columns({
//     id: string(),
//     slug: string(),
//     title: string().optional(),
//     editorLanguage: string(),
//   })
//   .primaryKey('id')
//
// const roomsRelationships = relationships(rooms, ({ one, many }) => ({}))
//
// export const schema = createSchema(1, {
//   tables: [rooms],
//   relationships: [roomsRelationships],
// })

export type AuthJWT = {
  sub: string
  iat: number
  name: string
  picture: string | null
  email: string
  isAnonymous: boolean | null
}

export type Schema = typeof schema
export type ZeroSchema = Schema

export const permissions = definePermissions<AuthJWT, Schema>(schema, () => {
  return {}
})
