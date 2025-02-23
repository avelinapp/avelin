import { type BaseColor, colors } from '@/lib/rooms'
import {
  type AwarenessList,
  USER_IDLE_TIMEOUT,
  type UserAwareness,
} from '@/lib/sync'
import type { HocuspocusProvider } from '@hocuspocus/provider'
import { useEffect, useMemo, useState } from 'react'

type CursorsProps = {
  provider: HocuspocusProvider
}

export function Cursors({ provider }: CursorsProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([])
  const [tick, setTick] = useState(false)

  useEffect(() => {
    // On changes, update `awarenessUsers`
    function setUsers({
      added,
      updated,
      // removed,
    }: {
      added: number[]
      updated: number[]
      // removed: number[]
    }) {
      // console.log('Added client IDs:', added)
      // console.log('Updated client IDs:', updated)
      const updatedAwarenessUsers = (
        [...provider.awareness!.getStates()] as AwarenessList
      ).map(([clientId, client]: [number, UserAwareness]) => {
        if (
          (added.includes(clientId) || updated.includes(clientId)) &&
          !!client.user
        ) {
          // Update lastActive timestamp
          console.log(`[CHANGED] ${client.user.name}`)

          return [
            clientId,
            {
              user: { ...client.user, lastActive: Date.now() },
            },
          ] satisfies [number, UserAwareness]
        }

        console.log(
          `[UNCHANGED] ${client?.user?.name} last active ${client?.user ? new Date(client.user.lastActive).toLocaleTimeString() : 'UNKNOWN'}`,
        )

        const prevAwarenessEntry = awarenessUsers.find(
          ([clientId2]) => clientId2 === clientId,
        )

        if (!prevAwarenessEntry) {
          console.log(
            'No previous awareness entry found for',
            client.user?.name,
          )
          return [clientId, client] satisfies [number, UserAwareness]
        }

        const [_, prevAwareness] = prevAwarenessEntry

        const newAwareness: UserAwareness = {
          ...client,
          user: { ...client.user!, lastActive: prevAwareness.user!.lastActive },
        }
        return [clientId, newAwareness] satisfies [number, UserAwareness]
      })

      setAwarenessUsers(updatedAwarenessUsers)
    }

    provider.awareness!.on('change', setUsers)

    return () => {
      provider.awareness!.off('change', setUsers)
    }
  }, [provider, awarenessUsers])

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => !t)
    }, USER_IDLE_TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  // Insert awareness info into cursors with styles
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const styleSheet = useMemo(() => {
    let cursorStyles = ''

    const now = Date.now()

    // console.log('Awareness users no.:', awarenessUsers.length)

    for (const [clientId, client] of awarenessUsers) {
      if (client?.user) {
        const elapsed = now - client.user.lastActive
        const isActive = elapsed < USER_IDLE_TIMEOUT
        // const isActive = Date.now() - client.user.lastActive < USER_IDLE_TIMEOUT

        if (client.user.name !== 'Kian Bazarjani') {
          // console.log(
          //   `[CURSORS] ${client.user.name} last active: ${new Date(client.user.lastActive).toLocaleTimeString()}`,
          // )
        }
        console.log(
          `[CURSORS] ${client.user.name} ${isActive ? 'ACTIVE' : 'NOT ACTIVE'} - last active ${client.user.lastActive}`,
        )
        const color = colors[client.user.color as BaseColor]

        cursorStyles += `
          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${color.name};
            --user-cursor: ${color.cursor};
            --user-cursor-selection: ${color.cursor_selection};
          }

          .yRemoteSelectionHead-${clientId}::after  {
            content: "${client.user.name}";
            --user-cursor: ${color.cursor};
            --name-opacity: ${isActive ? 1 : 0};
            --name-visibility: ${isActive ? 'visible' : 'hidden'};
            --name-scale: ${isActive ? 1 : 0.9};
          }
        `
      }
    }

    // console.log('---------')

    return { __html: cursorStyles }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awarenessUsers, tick])

  // biome-ignore lint/security/noDangerouslySetInnerHtml:
  return <style dangerouslySetInnerHTML={styleSheet} />
}
