import { Box, Text, Spinner } from '@0xsequence/design-system'
import { useEffect, useState } from 'react'
import { sequence } from '../../main'
import { Sessions } from '@0xsequence/waas'

export function ListSessionsView() {
  const [sessions, setSessions] = useState<Sessions>()
  const [_, setThisSession] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  const [getSessionsError, setGetSessionsError] = useState<string>()

  const closeSession = async (id: string) => {
    setLoading(true)
    setSessions(undefined)
    try {
      await sequence.dropSession({ sessionId: id })
      setSessions(await sequence.listSessions())
    } catch (e: any) {
      setGetSessionsError(e.message)
      setSessions(await sequence.listSessions())
    }

    setLoading(false)
  }

  useEffect(() => {
    Promise.all([sequence.listSessions(), sequence.getSessionId()])
      .then(([s, t]) => {
        setSessions(s)
        setThisSession(t)
        setLoading(false)
      })
      .catch(e => {
        setGetSessionsError(e.message)
        setLoading(false)
      })
  }, [])

  return (
    <Box>
      <Box marginBottom="5">
        <Box marginBottom="5">
          <Text variant="normal" color="text100" fontWeight="bold">
            Your open sessions:
          </Text>
        </Box>
        {sessions && (
          <>
            {sessions.map(s => (
              <Box key={s.id}>
                <Text variant="normal" color="text100" fontWeight="normal">
                  {s.friendlyName}
                  {!s.isThis && (
                    <a
                      style={{
                        marginLeft: '7px',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      onClick={() => closeSession(s.id)}
                    >
                      x
                    </a>
                  )}
                  {s.isThis && <> (current)</>}
                </Text>
              </Box>
            ))}
          </>
        )}
        {loading && <Spinner />}
      </Box>
      {getSessionsError && (
        <Text variant="normal" color="text100" fontWeight="bold">
          Error loading sessions: {getSessionsError}
        </Text>
      )}
    </Box>
  )
}
