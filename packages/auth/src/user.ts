import { db, schema } from '@avelin/database'
import { newId } from '@avelin/id'
import { eq } from 'drizzle-orm'

export async function getUserByGoogleId(googleId: string) {
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

export async function createUserViaGoogle(data: CreateUserViaGoogle) {
  const existingUser = await getUserByGoogleId(data.googleId)

  if (existingUser) {
    throw new Error('User already exists')
  }

  const newUser = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(schema.users)
      .values({
        id: newId('user'),
        name: data.name,
        email: data.email,
        picture: data.picture,
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
