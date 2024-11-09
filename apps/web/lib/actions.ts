'use server'

import { cookies } from 'next/headers'
import { validateSession } from '@avelin/auth'

export async function checkAuth() {
  const sessionCookie = cookies().get('avelin_session_id')

  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  return await validateSession(sessionCookie.value)
}
