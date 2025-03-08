import { customAlphabet } from 'nanoid'
import { v7 as uuidv7 } from 'uuid'

const prefixes = {
  user: 'user',
  session: 'session',
  account: 'account',
  verification: 'verification',
  jwk: 'jwk',
  room: 'room',
  waitlistEntry: 'wle',
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet)

export function newId(prefix: keyof typeof prefixes): string {
  const pre = prefixes[prefix]
  const id = uuidv7().replace(/-/g, '')

  return `${pre}_${id}`
}

export function newRoomSlug() {
  return nanoid(6)
}
