'use server'

import { cookies as getCookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession } from '@avelin/auth'

export async function checkAuth() {
  const cookies = await getCookies()
  const sessionCookie = cookies.get('avelin_session_id')

  if (!sessionCookie || !sessionCookie.value) {
    return redirect('/login')
  }

  const auth = await validateSession(sessionCookie.value)

  if (!auth) {
    return redirect('/login')
  }

  return auth
}
