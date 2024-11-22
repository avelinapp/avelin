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
    hostname += ':' + url.port
  }

  return hostname
}
