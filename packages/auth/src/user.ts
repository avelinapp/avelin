import { schema, eq, NeonDatabase } from '@avelin/database'
import { newId } from '@avelin/id'
import { storage } from '@avelin/storage'

export async function getUserByGoogleId(
  googleId: string,
  { db }: { db: NeonDatabase },
) {
  const [existingUser] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .innerJoin(
      schema.oauthAccounts,
      eq(schema.users.id, schema.oauthAccounts.userId),
    )
    .where(eq(schema.oauthAccounts.providerUserId, googleId))
    .limit(1)

  return existingUser
}

interface CreateUserViaGoogle {
  googleId: string
  name: string
  email: string
  picture: string
}

export async function createUserViaGoogle(
  data: CreateUserViaGoogle,
  { db }: { db: NeonDatabase },
) {
  const existingUser = await getUserByGoogleId(data.googleId, { db })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const pictureUrl = await storage.upload({ imageUrl: data.picture })

  const newUser = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(schema.users)
      .values({
        id: newId('user'),
        name: data.name,
        email: data.email,
        picture: pictureUrl,
      })
      .returning()

    if (!user) {
      throw new Error('Failed to create user')
    }

    await tx
      .insert(schema.oauthAccounts)
      .values({
        providerId: 'google',
        providerUserId: data.googleId,
        userId: user.id,
      })
      .returning()

    return user
  })

  return newUser
}

export async function createAnonymousUser({ db }: { db: NeonDatabase }) {
  const id = newId('user')

  const [newUser] = await db
    .insert(schema.users)
    .values({
      id,
      name: 'Anonymous User',
      email: `${id}@anon.avelin.app`,
      isAnonymous: true,
    })
    .returning()

  if (!newUser) {
    throw new Error('Failed to create anonymous user')
  }

  return newUser
}
