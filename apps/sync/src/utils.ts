import * as Y from 'yjs'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'

import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'
import { ServerWebSocket } from 'bun'

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const wsReadyStateClosing = 2 // eslint-disable-line
const wsReadyStateClosed = 3 // eslint-disable-line

const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0'

const docs = new Map()

const messageSync = 0
const messageAwareness = 1

const updateHandler = (
  update: Uint8Array,
  _origin: any,
  doc: WSSharedDoc,
  _tr: any,
) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  doc.conns.forEach((_, conn) => send(doc, conn, message))
}

let contentInitializor = (_ydoc: Y.Doc) => Promise.resolve()

/**
 * This function is called once every time a Yjs document is created. You can
 * use it to pull data from an external source or initialize content.
 *
 * @param {(ydoc: Y.Doc) => Promise<void>} f
 */
exports.setContentInitializor = (f: any) => {
  contentInitializor = f
}

const getYDoc = (docname: string, gc = true) =>
  map.setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname)
    doc.gc = gc

    docs.set(docname, doc)
    return doc
  })

const messageListener = (conn: any, doc: WSSharedDoc, message: Uint8Array) => {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

        // If the `encoder` only contains the type of reply message and no
        // message, there is no need to send the message. When `encoder` only
        // contains the type of reply, its length is 1.
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break
      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(
          doc.awareness,
          decoding.readVarUint8Array(decoder),
          conn,
        )
        break
      }
    }
  } catch (err) {
    console.error(err)
    // @ts-ignore
    doc.emit('error', [err])
  }
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const closeConn = (doc: WSSharedDoc, conn: any) => {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.conns.get(conn)
    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(
      doc.awareness,
      // @ts-ignore
      Array.from(controlledIds),
      null,
    )
    // if (doc.conns.size === 0 && persistence !== null) {
    //   // if persisted, we store state and destroy ydocument
    //   persistence.writeState(doc.name, doc).then(() => {
    //     doc.destroy()
    //   })
    //   docs.delete(doc.name)
    // }
  }
  conn.close()
}

/**
 * @param {WSSharedDoc} doc
 * @param {import('ws').WebSocket} conn
 * @param {Uint8Array} m
 */
const send = (doc: WSSharedDoc, conn: any, m: Uint8Array) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m, {}, (err: any) => {
      err != null && closeConn(doc, conn)
    })
  } catch (e) {
    closeConn(doc, conn)
  }
}

const pingTimeout = 30000

export const setupWSConnection = (
  conn: WebSocket,
  req: Request,
  { docName = (req.url || '').slice(1).split('?')[0], gc = true } = {},
) => {
  conn.binaryType = 'arraybuffer'
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docName, gc)
  doc.conns.set(conn, new Set())
  // listen and reply to events
  conn.on('message', (message: ArrayBuffer) =>
    messageListener(conn, doc, new Uint8Array(message)),
  )

  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn)
      }
      clearInterval(pingInterval)
    } else if (doc.conns.has(conn)) {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        closeConn(doc, conn)
        clearInterval(pingInterval)
      }
    }
  }, pingTimeout)
  conn.on('close', () => {
    closeConn(doc, conn)
    clearInterval(pingInterval)
  })
  conn.on('pong', () => {
    pongReceived = true
  })
  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    send(doc, conn, encoding.toUint8Array(encoder))
    const awarenessStates = doc.awareness.getStates()
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys()),
        ),
      )
      send(doc, conn, encoding.toUint8Array(encoder))
    }
  }
}

class WSSharedDoc extends Y.Doc {
  name: string = ''
  conns: Map<any, Set<number>> = new Map()
  awareness: awarenessProtocol.Awareness = new awarenessProtocol.Awareness(this)

  constructor(name: string) {
    super({ gc: gcEnabled })
    this.name = name
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     */
    this.conns = new Map()
    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)
    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = (
      {
        added,
        updated,
        removed,
      }: {
        added: Array<number>
        updated: Array<number>
        removed: Array<number>
      },
      conn: Object | null,
    ) => {
      const changedClients = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs =
          /** @type {Set<number>} */ this.conns.get(conn)
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID)
          })
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID)
          })
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients),
      )
      const buff = encoding.toUint8Array(encoder)
      this.conns.forEach((_, c) => {
        send(this, c, buff)
      })
    }
    this.awareness.on('update', awarenessChangeHandler)
    // @ts-ignore
    this.on('update', /** @type {any} */ updateHandler)
    // if (isCallbackSet) {
    //   this.on(
    //     'update',
    //     /** @type {any} */ debounce(callbackHandler, CALLBACK_DEBOUNCE_WAIT, {
    //       maxWait: CALLBACK_DEBOUNCE_MAXWAIT,
    //     }),
    //   )
    // }

    // @ts-ignore
    this.whenInitialized = contentInitializor(this)
  }
}
