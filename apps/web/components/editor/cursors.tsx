import { assignOption, colors, generateUniqueName } from '@/lib/rooms'
import { AwarenessList, UserAwareness } from '@/lib/sync'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useEffect, useMemo, useState } from 'react'

type CursorsProps = {
  provider: HocuspocusProvider
}

export function Cursors({ provider }: CursorsProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([])

  useEffect(() => {
    const assignedColors = Array.from(
      provider.awareness!.getStates().values(),
    ).map(({ user }) => user?.color)

    console.log(assignedColors)

    const color = assignOption(Object.values(colors), assignedColors)

    const localUser: UserAwareness['user'] = {
      name: generateUniqueName(),
      color: color,
    }

    provider.awareness?.setLocalStateField('user', localUser)

    // On changes, update `awarenessUsers`
    function setUsers() {
      console.log(provider.awareness!.getStates())
      setAwarenessUsers([...provider.awareness!.getStates()] as AwarenessList)
    }

    provider.awareness!.on('change', setUsers)
    setUsers()

    return () => {
      provider.awareness!.off('change', setUsers)
    }
  }, [provider])

  // Insert awareness info into cursors with styles
  const styleSheet = useMemo(() => {
    let cursorStyles = ''

    for (const [clientId, client] of awarenessUsers) {
      if (client?.user) {
        cursorStyles += `
          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${client.user.color};
          }

          .yRemoteSelectionHead-${clientId}::after  {
            content: "${client.user.name}";
          }

          .yRemoteSelection-${clientId} {
            background-color: ${client.user.color};
          }

          
        `
      }
    }

    console.log(cursorStyles)

    return { __html: cursorStyles }
  }, [awarenessUsers])

  return <style dangerouslySetInnerHTML={styleSheet} />
}
