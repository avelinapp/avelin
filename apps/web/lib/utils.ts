export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function getPrettyHostname(input?: string | URL) {
  const url = !input
    ? new URL(process.env.NEXT_PUBLIC_APP_URL as string)
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
