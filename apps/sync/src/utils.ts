import * as Y from 'yjs'
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from 'y-protocols/awareness'
import {
  createEncoder,
  writeVarUint,
  writeVarUint8Array,
  toUint8Array,
  length,
} from 'lib0/encoding'
import { setIfUndefined } from 'lib0/map'
import { ServerWebSocket } from 'bun'
import { readSyncMessage, writeUpdate } from 'y-protocols/sync.js'
import { createDecoder, readVarUint, readVarUint8Array } from 'lib0/decoding.js'

export type AwarenessChanges = {
  added: Array<number>
  updated: Array<number>
  removed: Array<number>
}

export const MESSAGE_SYNC = 0
export const MESSAGE_AWARENESS = 1
export const MESSAGE_PING = 127 // Arbitrary unique number
export const MESSAGE_PONG = 128

export const WS_READY_STATE_CONNECTING = 0
export const WS_READY_STATE_OPEN = 1
export const WS_READY_STATE_CLOSING = 2
export const WS_READY_STATE_CLOSED = 3

export const docs = new Map<string, WSSharedDoc>()

export class WSSharedDoc extends Y.Doc {
  name: string
  conns: Map<ServerWebSocket, Set<number>>
  awareness: Awareness
  whenInitialized: Promise<void>

  constructor(name: string) {
    super({ gc: true })

    this.name = name
    this.conns = new Map<ServerWebSocket, Set<number>>()
    this.awareness = new Awareness(this)
    this.awareness.setLocalState(null)

    this.awareness.on(
      'update',
      (
        { added, updated, removed }: AwarenessChanges,
        conn: ServerWebSocket | null,
      ) => {
        const changedClients = added.concat(updated, removed)
        if (conn !== null) {
          const connControlledIDs = this.conns.get(conn)
          if (connControlledIDs) {
            added.forEach((clientID) => {
              connControlledIDs.add(clientID)
            })
            removed.forEach((clientID) => {
              connControlledIDs.delete(clientID)
            })
          }
        }

        // Broadcast awareness update
        const encoder = createEncoder()
        writeVarUint(encoder, MESSAGE_AWARENESS)
        writeVarUint8Array(
          encoder,
          encodeAwarenessUpdate(this.awareness, changedClients),
        )
        const buff = toUint8Array(encoder)
        this.conns.forEach((_, c) => {
          send(this, c, buff)
        })
      },
    )

    this.on(
      'update',
      (update: Uint8Array, _origin: any, doc: Y.Doc, _tr: any) => {
        const encoder = createEncoder()
        writeVarUint(encoder, MESSAGE_SYNC)
        writeUpdate(encoder, update)
        const message = toUint8Array(encoder)

        const sharedDoc = doc as WSSharedDoc
        sharedDoc.conns.forEach((_, conn) => {
          send(sharedDoc, conn, message)
        })
      },
    )

    this.whenInitialized = contentInitializor(this)
  }
}

export const closeConn = (doc: WSSharedDoc, conn: ServerWebSocket) => {
  if (doc.conns.has(conn)) {
    const controlledIds = doc.conns.get(conn) as Set<number>
    doc.conns.delete(conn)
    removeAwarenessStates(doc.awareness, Array.from(controlledIds), null)
  }
  conn.close()
}

export const send = (
  doc: WSSharedDoc,
  conn: ServerWebSocket,
  m: Uint8Array,
) => {
  if (
    conn.readyState !== WS_READY_STATE_CONNECTING &&
    conn.readyState !== WS_READY_STATE_OPEN
  ) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m)
  } catch (error) {
    if (error !== null) closeConn(doc, conn)
  }
}

const contentInitializor = (_ydoc: Y.Doc) => Promise.resolve()

export const getYDoc = (docname: string, gc = true) =>
  setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname)
    doc.gc = gc
    docs.set(docname, doc)
    return doc
  })

export const messageListener = (
  conn: ServerWebSocket,
  doc: WSSharedDoc,
  message: Uint8Array,
) => {
  try {
    const encoder = createEncoder()
    const decoder = createDecoder(message)
    const messageType = readVarUint(decoder)
    switch (messageType) {
      case MESSAGE_SYNC:
        writeVarUint(encoder, MESSAGE_SYNC)
        readSyncMessage(decoder, encoder, doc, conn)
        if (length(encoder) > 1) {
          send(doc, conn, toUint8Array(encoder))
        }
        break
      case MESSAGE_AWARENESS: {
        applyAwarenessUpdate(doc.awareness, readVarUint8Array(decoder), conn)
        break
      }
    }
  } catch (err) {
    console.error(err)
    // @ts-ignore
    doc.emit('error', [err])
  }
}
