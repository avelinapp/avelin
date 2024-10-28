import { assignOption, colors, generateUniqueName } from '@/lib/rooms'
import { AwarenessList, USER_IDLE_TIMEOUT, UserAwareness } from '@/lib/sync'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useEffect, useMemo, useState } from 'react'

type CursorsProps = {
  provider: HocuspocusProvider
}

export function Cursors({ provider }: CursorsProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([])
  const [tick, setTick] = useState(false)

  useEffect(() => {
    const assignedColors = Array.from(
      provider.awareness!.getStates().values(),
    ).map(({ user }) => user?.color)

    const color = assignOption(Object.values(colors), assignedColors)

    const localUser: UserAwareness['user'] = {
      name: generateUniqueName(),
      color: color,
      lastActive: Date.now(),
    }

    provider.awareness?.setLocalStateField('user', localUser)

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
      const newAwarenessUsers = (
        [...provider.awareness!.getStates()] as AwarenessList
      ).map(([clientId, client]: [number, UserAwareness]) => {
        if (
          (added.includes(clientId) || updated.includes(clientId)) &&
          !!client.user
        ) {
          // Update lastActive timestamp
          return [
            clientId,
            {
              user: { ...client.user, lastActive: Date.now() },
            },
          ] satisfies [number, UserAwareness]
        } else {
          return [clientId, client] satisfies [number, UserAwareness]
        }
      })

      setAwarenessUsers(newAwarenessUsers)
    }

    provider.awareness!.on('change', setUsers)

    return () => {
      provider.awareness!.off('change', setUsers)
    }
  }, [provider])

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => !t)
    }, USER_IDLE_TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  // Insert awareness info into cursors with styles
  const styleSheet = useMemo(() => {
    let cursorStyles = ''

    for (const [clientId, client] of awarenessUsers) {
      if (client?.user) {
        const isActive = Date.now() - client.user.lastActive < USER_IDLE_TIMEOUT

        cursorStyles += `
          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${client.user.color};
          }

          .yRemoteSelectionHead-${clientId}::after  {
            content: "${client.user.name}";
            --name-opacity: ${isActive ? 1 : 0};
            --name-visibility: ${isActive ? 'visible' : 'hidden'};
          }

          .yRemoteSelection-${clientId} {
            background-color: ${client.user.color};
          }
        `
      }
    }

    return { __html: cursorStyles }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awarenessUsers, tick])

  return <style dangerouslySetInnerHTML={styleSheet} />
}
