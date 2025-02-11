import type { IncomingHttpHeaders } from 'node:http'
import type { Hocuspocus, IncomingMessage } from '@hocuspocus/server'

export type OnConnectCallbackParams = {
  documentName: string
  instance: Hocuspocus
  request: IncomingMessage
  requestHeaders: IncomingHttpHeaders
  requestParameters: URLSearchParams
  socketId: string
  connection: {
    readOnly: boolean
  }
}
