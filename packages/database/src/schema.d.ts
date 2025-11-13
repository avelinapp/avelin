export declare const users: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'users'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'users'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'users'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'users'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'users'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    email: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'email'
        tableName: 'users'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    emailVerified: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'emailVerified'
        tableName: 'users'
        dataType: 'boolean'
        columnType: 'PgBoolean'
        data: boolean
        driverParam: boolean
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    name: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'name'
        tableName: 'users'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    picture: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'picture'
        tableName: 'users'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    isAnonymous: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'isAnonymous'
        tableName: 'users'
        dataType: 'boolean'
        columnType: 'PgBoolean'
        data: boolean
        driverParam: boolean
        notNull: false
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    retiredAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'retiredAt'
        tableName: 'users'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    isAdminUser: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'isAdminUser'
        tableName: 'users'
        dataType: 'boolean'
        columnType: 'PgBoolean'
        data: boolean
        driverParam: boolean
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const usersRelations: import('drizzle-orm').Relations<
  'users',
  {
    oauthAccounts: import('drizzle-orm').Many<'accounts'>
    sessions: import('drizzle-orm').Many<'sessions'>
    createdRooms: import('drizzle-orm').Many<'rooms'>
    joinedRooms: import('drizzle-orm').Many<'room_participants'>
    roomConnections: import('drizzle-orm').Many<'room_connections'>
  }
>
export declare const accounts: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'accounts'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'accounts'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'accounts'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'accounts'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    providerId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'providerId'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    accountId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'accountId'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userId'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    accessToken: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'accessToken'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    refreshToken: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'refreshToken'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    idToken: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'idToken'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    accessTokenExpiresAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'accessTokenExpiresAt'
        tableName: 'accounts'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    refreshTokenExpiresAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'refreshTokenExpiresAt'
        tableName: 'accounts'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    scope: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'scope'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    password: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'password'
        tableName: 'accounts'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const accountsRelations: import('drizzle-orm').Relations<
  'accounts',
  {
    user: import('drizzle-orm').One<'users', true>
  }
>
export declare const sessions: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'sessions'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'sessions'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'sessions'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'sessions'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'sessions'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    token: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'token'
        tableName: 'sessions'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userId'
        tableName: 'sessions'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    ipAddress: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'ipAddress'
        tableName: 'sessions'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userAgent: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userAgent'
        tableName: 'sessions'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    expiresAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'expiresAt'
        tableName: 'sessions'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const sessionsRelations: import('drizzle-orm').Relations<
  'sessions',
  {
    user: import('drizzle-orm').One<'users', true>
  }
>
export declare const verifications: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'verifications'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'verifications'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'verifications'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'verifications'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'verifications'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    identifier: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'identifier'
        tableName: 'verifications'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    value: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'value'
        tableName: 'verifications'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    expiresAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'expiresAt'
        tableName: 'verifications'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const jwks: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'jwks'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'jwks'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'jwks'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'jwks'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'jwks'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    publicKey: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'publicKey'
        tableName: 'jwks'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    privateKey: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'privateKey'
        tableName: 'jwks'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const rooms: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'rooms'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'rooms'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'rooms'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'rooms'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    slug: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'slug'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    staticSlug: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'staticSlug'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    ydoc: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'ydoc'
        tableName: 'rooms'
        dataType: 'custom'
        columnType: 'PgCustomColumn'
        data: Buffer<ArrayBufferLike>
        driverParam: unknown
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {
        pgColumnBuilderBrand: 'PgCustomColumnBuilderBrand'
      }
    >
    title: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'title'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    editorLanguage: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'editorLanguage'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    creatorId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'creatorId'
        tableName: 'rooms'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const roomsRelations: import('drizzle-orm').Relations<
  'rooms',
  {
    creator: import('drizzle-orm').One<'users', false>
    roomParticipants: import('drizzle-orm').Many<'room_participants'>
    connections: import('drizzle-orm').Many<'room_connections'>
  }
>
export declare const roomParticipants: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'room_participants'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'room_participants'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'room_participants'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'room_participants'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    roomId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'roomId'
        tableName: 'room_participants'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userId'
        tableName: 'room_participants'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    lastAccessedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'lastAccessedAt'
        tableName: 'room_participants'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const roomParticipantsRelations: import('drizzle-orm').Relations<
  'room_participants',
  {
    user: import('drizzle-orm').One<'users', true>
    room: import('drizzle-orm').One<'rooms', true>
  }
>
export declare const roomConnections: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'room_connections'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'room_connections'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'room_connections'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'room_connections'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'room_connections'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    roomId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'roomId'
        tableName: 'room_connections'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userId'
        tableName: 'room_connections'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    serverId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'serverId'
        tableName: 'room_connections'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    connectedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'connectedAt'
        tableName: 'room_connections'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    disconnectedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'disconnectedAt'
        tableName: 'room_connections'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    isActive: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'isActive'
        tableName: 'room_connections'
        dataType: 'boolean'
        columnType: 'PgBoolean'
        data: boolean
        driverParam: boolean
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const roomConnectionsRelations: import('drizzle-orm').Relations<
  'room_connections',
  {
    user: import('drizzle-orm').One<'users', true>
    room: import('drizzle-orm').One<'rooms', true>
  }
>
export declare const waitlistStatusEnum: import('drizzle-orm/pg-core').PgEnum<
  ['waitlist_joined', 'invite_sent', 'invite_accepted']
>
export declare const waitlistEntries: import('drizzle-orm/pg-core').PgTableWithColumns<{
  name: 'waitlist_entries'
  schema: undefined
  columns: {
    updatedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'updatedAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    createdAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'createdAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    deletedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'deletedAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    id: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'id'
        tableName: 'waitlist_entries'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: true
        isAutoincrement: false
        hasRuntimeDefault: true
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    userId: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'userId'
        tableName: 'waitlist_entries'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    email: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'email'
        tableName: 'waitlist_entries'
        dataType: 'string'
        columnType: 'PgText'
        data: string
        driverParam: string
        notNull: true
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: [string, ...string[]]
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    position: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'position'
        tableName: 'waitlist_entries'
        dataType: 'number'
        columnType: 'PgInteger'
        data: number
        driverParam: string | number
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: 'byDefault'
        generated: undefined
      },
      {},
      {}
    >
    status: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'status'
        tableName: 'waitlist_entries'
        dataType: 'string'
        columnType: 'PgEnumColumn'
        data: 'waitlist_joined' | 'invite_sent' | 'invite_accepted'
        driverParam: string
        notNull: true
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: ['waitlist_joined', 'invite_sent', 'invite_accepted']
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    joinedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'joinedAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: true
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    invitedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'invitedAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
    acceptedAt: import('drizzle-orm/pg-core').PgColumn<
      {
        name: 'acceptedAt'
        tableName: 'waitlist_entries'
        dataType: 'date'
        columnType: 'PgTimestamp'
        data: Date
        driverParam: string
        notNull: false
        hasDefault: false
        isPrimaryKey: false
        isAutoincrement: false
        hasRuntimeDefault: false
        enumValues: undefined
        baseColumn: never
        identity: undefined
        generated: undefined
      },
      {},
      {}
    >
  }
  dialect: 'pg'
}>
export declare const waitlistEntriesRelations: import('drizzle-orm').Relations<
  'waitlist_entries',
  {
    user: import('drizzle-orm').One<'users', false>
  }
>
//# sourceMappingURL=schema.d.ts.map
