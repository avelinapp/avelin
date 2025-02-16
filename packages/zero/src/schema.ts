import * as drizzleSchema from '@avelin/database/schema'
import {
  ANYONE_CAN,
  type Condition,
  type ExpressionBuilder,
  NOBODY_CAN,
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

type TableName = keyof Schema['tables']

type PermissionRule<TTable extends TableName> = (
  authData: AuthJWT,
  eb: ExpressionBuilder<Schema, TTable>,
) => Condition

function and<TTable extends TableName>(
  ...rules: PermissionRule<TTable>[]
): PermissionRule<TTable> {
  return (authData, eb) => eb.and(...rules.map((rule) => rule(authData, eb)))
}

export const permissions = definePermissions<AuthJWT, Schema>(schema, () => {
  const userIsLoggedIn = (
    authData: AuthJWT,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.sub, 'IS NOT', null)

  return {
    rooms: {
      row: {
        insert: NOBODY_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
        select: ANYONE_CAN,
      },
    },
    roomParticipants: {
      row: {
        insert: NOBODY_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
        select: ANYONE_CAN,
      },
    },
  }
})
