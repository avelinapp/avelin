import { Hocuspocus, IncomingMessage } from '@hocuspocus/server'
import { IncomingHttpHeaders } from 'node:http'

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
