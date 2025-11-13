import {
  ANYONE_CAN,
  definePermissions,
  type ExpressionBuilder,
  NOBODY_CAN,
  type PermissionsConfig,
  type Row,
  type Schema,
} from '@rocicorp/zero'
import { schema as genSchema } from './zero-schema.gen.js'

export const schema = {
  ...genSchema,
} as const satisfies Schema

export type ZeroSchema = typeof schema

export type AuthData = {
  sub: string
  iat: number
  name: string
  picture: string | null
  email: string
  isAnonymous: boolean | null
  isAdminUser: boolean
}

export namespace Zero {
  export namespace Schema {
    export type Room = Row<typeof schema.tables.rooms>
    export type RoomParticipant = Row<typeof schema.tables.roomParticipants>
    export type RoomConnection = Row<typeof schema.tables.roomConnections>
    export type User = Row<typeof schema.tables.users>
    export type WaitlistEntry = Row<typeof schema.tables.waitlistEntries>
  }
}

type TableName = keyof ZeroSchema['tables']

export const permissions: ReturnType<typeof definePermissions> =
  definePermissions<AuthData, ZeroSchema>(schema, () => {
    const userIsLoggedIn = (
      authData: AuthData,
      { cmpLit }: ExpressionBuilder<ZeroSchema, TableName>,
    ) => cmpLit(authData.sub, 'IS NOT', null)

    const loggedInUserIsAdmin = (
      authData: AuthData,
      eb: ExpressionBuilder<ZeroSchema, TableName>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmpLit(authData.isAdminUser, 'IS', true),
      )

    const loggedInUserIsCreator = (
      authData: AuthData,
      eb: ExpressionBuilder<ZeroSchema, 'rooms'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmp('creatorId', '=', authData.sub),
      )

    const loggedInUserIsRoomParticipantForRoom = (
      authData: AuthData,
      eb: ExpressionBuilder<ZeroSchema, 'rooms'>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.exists('participants', (q) =>
          q.where((eb) => eb.cmp('id', authData.sub)),
        ),
      )

    const loggedInUserIsRoomParticipant = (
      authData: AuthData,
      eb: ExpressionBuilder<ZeroSchema, 'roomParticipants'>,
    ) =>
      eb.and(userIsLoggedIn(authData, eb), eb.cmp('userId', '=', authData.sub))

    const canDeleteRoomParticipant = (
      authData: AuthData,
      eb: ExpressionBuilder<ZeroSchema, 'roomParticipants'>,
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
      eb: ExpressionBuilder<ZeroSchema, 'roomConnections'>,
    ) =>
      eb.and(userIsLoggedIn(authData, eb), eb.cmp('userId', '=', authData.sub))

    const canDeleteRoomConnection = (
      authDate: AuthData,
      eb: ExpressionBuilder<ZeroSchema, 'roomConnections'>,
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
    } satisfies PermissionsConfig<AuthData, ZeroSchema>
  })
