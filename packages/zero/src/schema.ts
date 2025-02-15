import { schema as drizzleSchema } from '@avelin/database'
import { ANYONE_CAN, definePermissions } from '@rocicorp/zero'
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
      slug: true,
      ydoc: false,
      title: true,
      editorLanguage: true,
      creatorId: true,
      createdAt: false,
      updatedAt: false,
      deletedAt: true,
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

type AuthJWT = {
  sub: string
}

type ZeroSchema = typeof schema

export const permissions = definePermissions<AuthJWT, ZeroSchema>(
  schema,
  () => {
    return {
      users: {
        select: ANYONE_CAN,
        create: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    }
  },
)
