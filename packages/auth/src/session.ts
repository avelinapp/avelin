import {
  type CreateSession,
  type NeonDatabase,
  type Session,
  type User,
  eq,
  schema,
} from '@avelin/database'
import { newId } from '@avelin/id'

export async function createSession(
  userId: string,
  { db }: { db: NeonDatabase },
): Promise<Session> {
  const sessionId = newId('session')
  const session: CreateSession = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  const [createdSession] = await db
    .insert(schema.sessions)
    .values(session)
    .returning()

  if (!createdSession) {
    throw new Error('Failed to create session')
  }

  return createdSession
}

export async function validateSession(
  sessionId: string,
  { db }: { db: NeonDatabase },
) {
  const [result] = await db
    .select({ user: schema.users, session: schema.sessions })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(eq(schema.sessions.id, sessionId))

  if (!result) {
    return null
  }

  const { user, session } = result

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId))
    return null
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db
      .update(schema.sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(schema.sessions.id, sessionId))
  }
  return { session, user }
}

export async function invalidateSession(
  sessionId: string,
  { db }: { db: NeonDatabase },
): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId))
}

export async function invalidateSessionsForUser(
  userId: string,
  { db }: { db: NeonDatabase },
): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId))
}

export type SessionValidationResult = { session: Session; user: User } | null
