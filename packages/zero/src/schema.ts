import * as drizzleSchema from '@avelin/database/schema'
import {
  ANYONE_CAN,
  type ExpressionBuilder,
  NOBODY_CAN,
  type Row,
  definePermissions,
} from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'
import zeroConfig from './zero-config.json' with { type: 'json' }

export const schema = createZeroSchema(drizzleSchema, {
  version: zeroConfig.zero.schemaVersion,
  tables: {
    users: {
      id: true,
      email: true,
      name: true,
      picture: true,
      isAnonymous: true,
      retiredAt: true,
      linkedUserId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    oauthAccounts: {
      providerId: true,
      providerUserId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    sessions: {
      id: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    rooms: {
      id: true,
      slug: true,
      ydoc: false,
      title: true,
      editorLanguage: true,
      creatorId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    roomParticipants: {
      roomId: true,
      userId: true,
      lastAccessedAt: true,
      isConnected: true,
      connectedAt: true,
      disconnectedAt: true,
      connectionCount: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  },
  manyToMany: {
    rooms: {
      participants: ['roomParticipants', 'users'],
    },
  },
})

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

export namespace Zero {
  export namespace Schema {
    export type Room = Row<typeof schema.tables.rooms>
    export type RoomParticipant = Row<typeof schema.tables.roomParticipants>
    export type User = Row<typeof schema.tables.users>
  }
}

type TableName = keyof Schema['tables']

export const permissions: ReturnType<typeof definePermissions> =
  definePermissions<AuthJWT, Schema>(schema, () => {
    const userIsLoggedIn = (
      authData: AuthJWT,
      { cmpLit }: ExpressionBuilder<Schema, TableName>,
    ) => cmpLit(authData.sub, 'IS NOT', null)

    const loggedInUserIsCreator = (
      authData: AuthJWT,
      eb: ExpressionBuilder<Schema, 'rooms'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmp('creatorId', '=', authData.sub),
      )

    const loggedInUserIsRoomParticipant = (
      authData: AuthJWT,
      eb: ExpressionBuilder<Schema, 'roomParticipants'>,
    ) =>
      eb.and(userIsLoggedIn(authData, eb), eb.cmp('userId', '=', authData.sub))

    const canDeleteRoomParticipant = (
      authData: AuthJWT,
      eb: ExpressionBuilder<Schema, 'roomParticipants'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        /* Allow the user to delete room participants if they are the creator of the room. */
        eb.exists('room', (q) =>
          q.where((eb) => loggedInUserIsCreator(authData, eb)),
        ),
      )

    return {
      rooms: {
        row: {
          insert: [loggedInUserIsCreator],
          update: {
            preMutation: [loggedInUserIsCreator],
            postMutation: [loggedInUserIsCreator],
          },
          delete: [loggedInUserIsCreator],
          select: ANYONE_CAN,
        },
      },
      roomParticipants: {
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: [loggedInUserIsRoomParticipant],
          },
          /*
           * Allow the user to delete room participants under the following conditions:
           * (1) they are the creator of the room - they can delete all room participants
           * (2) they are the room participant - they can delete only themselves
           */
          delete: [canDeleteRoomParticipant, loggedInUserIsRoomParticipant],
          select: ANYONE_CAN,
        },
      },
      users: {
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: NOBODY_CAN,
          },
          delete: NOBODY_CAN,
          select: ANYONE_CAN,
        },
      },
      oauthAccounts: {
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: NOBODY_CAN,
          },
          delete: NOBODY_CAN,
          select: NOBODY_CAN,
        },
      },
      sessions: {
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: NOBODY_CAN,
          },
          delete: NOBODY_CAN,
          select: NOBODY_CAN,
        },
      },
    }
  })
