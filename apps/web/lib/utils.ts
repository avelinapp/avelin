import { env } from './env'

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function getPrettyHostname(input?: string | URL) {
  const url = !input
    ? new URL(env.NEXT_PUBLIC_APP_URL)
    : input instanceof URL
      ? input
      : new URL(input)
  let hostname = url.hostname

  if (url.port !== '') {
    hostname += `:${url.port}`
  }

  return hostname
}

export function getHeaders(headers: Headers): Record<string, string> {
  const headersObject: Record<string, string> = {}

  headers.forEach((value, key) => {
    headersObject[key] = value
  })

  return headersObject
}

export function inArray<T>(value: T, array: T[]) {
  return array.indexOf(value) !== -1
}

export type DateLike = Date | number | string

function parseDate(input: DateLike) {
  // If it's already a Date object, return it.
  if (input instanceof Date) return input

  // If it's a number, determine if it's seconds or milliseconds.
  if (typeof input === 'number') {
    // If the number is less than 10^12, assume seconds (Unix timestamp in seconds).
    if (input < 1e12) {
      return new Date(input * 1000)
    }
    // Otherwise assume it's in milliseconds.
    return new Date(input)
  }

  // Otherwise, assume it's a string (ISO or otherwise).
  return new Date(input)
}

export function relativeTime(pastInput: DateLike) {
  const past = parseDate(pastInput)
  const now = new Date()
  const secondsElapsed = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (secondsElapsed < 60) {
    return 'just now'
  }

  const minutes = Math.floor(secondsElapsed / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`
  }

  const years = Math.floor(days / 365)
  if (years < 10) {
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }

  const decades = Math.floor(years / 10)
  return `${decades} decade${decades !== 1 ? 's' : ''} ago`
}
