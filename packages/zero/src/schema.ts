import { schema as drizzleSchema } from '@avelin/database'
import {
  ANYONE_CAN,
  type ExpressionBuilder,
  NOBODY_CAN,
  type PermissionsConfig,
  type Row,
  definePermissions,
} from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'

export const schema = createZeroSchema(drizzleSchema, {
  tables: {
    users: {
      id: true,
      email: true,
      emailVerified: true,
      name: true,
      picture: true,
      isAnonymous: true,
      retiredAt: true,
      isAdminUser: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    accounts: {
      id: true,
      providerId: true,
      accountId: true,
      userId: true,
      accessToken: false,
      refreshToken: false,
      idToken: false,
      accessTokenExpiresAt: false,
      refreshTokenExpiresAt: false,
      scope: false,
      password: false,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    sessions: {
      id: true,
      token: false,
      userId: true,
      ipAddress: true,
      userAgent: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    verifications: false,
    jwks: false,
    rooms: {
      id: true,
      slug: true,
      staticSlug: true,
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
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    roomConnections: {
      id: true,
      roomId: true,
      userId: true,
      serverId: true,
      connectedAt: true,
      disconnectedAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    waitlistEntries: {
      id: true,
      userId: true,
      email: true,
      position: true,
      status: true,
      joinedAt: true,
      invitedAt: true,
      acceptedAt: true,
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

export type AuthData = {
  sub: string
  iat: number
  name: string
  picture: string | null
  email: string
  isAnonymous: boolean | null
  isAdminUser: boolean
}

export type Schema = typeof schema
export type ZeroSchema = Schema

export namespace Zero {
  export namespace Schema {
    export type Room = Row<typeof schema.tables.rooms>
    export type RoomParticipant = Row<typeof schema.tables.roomParticipants>
    export type RoomConnection = Row<typeof schema.tables.roomConnections>
    export type User = Row<typeof schema.tables.users>
  }
}

type TableName = keyof Schema['tables']

export const permissions: ReturnType<typeof definePermissions> =
  definePermissions<AuthData, Schema>(schema, () => {
    const userIsLoggedIn = (
      authData: AuthData,
      { cmpLit }: ExpressionBuilder<Schema, TableName>,
    ) => cmpLit(authData.sub, 'IS NOT', null)

    const loggedInUserIsAdmin = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, TableName>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmpLit(authData.isAdminUser, 'IS', true),
      )

    const loggedInUserIsCreator = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, 'rooms'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmp('creatorId', '=', authData.sub),
      )

    const loggedInUserIsRoomParticipantForRoom = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, 'rooms'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.exists('participants', (q) =>
          q.where((eb) => eb.cmp('id', authData.sub)),
        ),
      )

    const loggedInUserIsRoomParticipant = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, 'roomParticipants'>,
    ) =>
      eb.and(userIsLoggedIn(authData, eb), eb.cmp('userId', '=', authData.sub))

    const canDeleteRoomParticipant = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, 'roomParticipants'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        /* Allow the user to delete room participants if they are the creator of the room. */
        eb.exists('room', (q) =>
          q.where((eb) => loggedInUserIsCreator(authData, eb)),
        ),
      )

    const loggedInUserIsRoomConnector = (
      authData: AuthData,
      eb: ExpressionBuilder<Schema, 'roomConnections'>,
    ) =>
      eb.and(userIsLoggedIn(authData, eb), eb.cmp('userId', '=', authData.sub))

    const canDeleteRoomConnection = (
      authDate: AuthData,
      eb: ExpressionBuilder<Schema, 'roomConnections'>,
    ) =>
      eb.and(
        userIsLoggedIn(authDate, eb),
        eb.exists('room', (q) =>
          q.where((eb) => loggedInUserIsCreator(authDate, eb)),
        ),
      )

    return {
      rooms: {
        row: {
          insert: [loggedInUserIsCreator],
          update: {
            preMutation: [
              loggedInUserIsCreator,
              loggedInUserIsRoomParticipantForRoom,
            ],
            postMutation: [
              loggedInUserIsCreator,
              loggedInUserIsRoomParticipantForRoom,
            ],
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
      roomConnections: {
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: [loggedInUserIsRoomConnector],
          },
          delete: [canDeleteRoomConnection],
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
      accounts: {
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
      waitlistEntries: {
        row: {
          insert: [loggedInUserIsAdmin],
          update: {
            preMutation: [loggedInUserIsAdmin],
          },
          delete: [loggedInUserIsAdmin],
          select: [loggedInUserIsAdmin],
        },
      },
    } satisfies PermissionsConfig<AuthData, Schema>
  })
