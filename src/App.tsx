import { useEffect, useState } from 'react'
import { Box, Text, Divider, Button, Spinner, Modal } from '@0xsequence/design-system'

import { router, sequence } from './main'

import { Logo } from './components/Logo'
import { SendTransactionsView } from './components/views/SendTransactionsView'
import { ListSessionsView } from './components/views/ListSessionsView'
import { googleLogout } from '@react-oauth/google'
import { SignMessageView } from './components/views/SignMessageView'
import { CallContractsView } from './components/views/CallContractsView'
import { AnimatePresence } from 'framer-motion'
import { PINCodeInput } from './components/PINCodeInput'

export interface Chain {
  id: number
  name: string
  isEnabled: boolean
}

function App() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [fetchWalletAddressError, setFetchWalletAddressError] = useState<string>()

  const [sessionValidationSalt, setSessionValidationSalt] = useState<string | undefined>()
  const [sessionValidationCode, setSessionValidationCode] = useState<string[]>([])
  const [isFinishValidateSessionPending, setIsFinishValidateSessionPending] = useState(false)

  useEffect(() => {
    sequence
      .getAddress()
      .then((address: string) => {
        setWalletAddress(address)
      })
      .catch((e: Error) => {
        setFetchWalletAddressError(e.message)
      })
  }, [])

  useEffect(() => {
    sequence.isSignedIn().then((signedIn: boolean) => {
      if (!signedIn) {
        router.navigate('/login')
      }
    })
  }, [])

  useEffect(() => {
    const code = sessionValidationCode.join('')
    if (code.length === 6 && sessionValidationSalt) {
      sequence.finishValidateSession(sessionValidationSalt, code)
      setIsFinishValidateSessionPending(true)
    }
  }, [sessionValidationCode])

  sequence.onValidationRequired(salt => {
    setSessionValidationSalt(salt)
    sequence.waitForSessionValid(600 * 1000, 4000).then((isValid: boolean) => {
      console.log('isValid', isValid)
      if (isValid) {
        setSessionValidationSalt(undefined)
      }
      setSessionValidationCode([])
      setIsFinishValidateSessionPending(false)
    })
  })

  return (
    <>
      <AnimatePresence>
        {sessionValidationSalt && (
          <Modal>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '1.2em',
                height: '50vh'
              }}
            >
              <Box flexDirection="column" alignItems="center">
                <Text marginBottom="7">Please enter the session verification code that was sent to your email</Text>
                <PINCodeInput value={sessionValidationCode} digits={6} onChange={setSessionValidationCode} />
                <Box marginTop="5">{isFinishValidateSessionPending && <Spinner />}</Box>
              </Box>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <Box marginY="0" marginX="auto" paddingX="6" style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
        <Box marginBottom="10">
          <Logo />
        </Box>

        <Box marginBottom="5" flexDirection="row">
          <Text marginTop="1" variant="normal" color="text100">
            Logged in with email:{' '}
            {/* <Text fontWeight="bold" underline>
              {email}
            </Text> */}
          </Text>

          <Button
            marginLeft="auto"
            label="Log out"
            size="xs"
            onClick={async () => {
              try {
                await sequence.dropSession({ strict: false })
              } catch (e: any) {
                console.warn(`Could not drop session: ${e.message}`)
              }

              googleLogout()
              router.navigate('/login')
            }}
          />
        </Box>

        <Divider background="buttonGlass" />

        <Box marginBottom="5">
          <Text variant="normal" color="text100" fontWeight="bold">
            Your wallet address:
          </Text>
        </Box>

        <Box marginBottom="4">
          {walletAddress ? (
            <Box>
              <Text>{walletAddress}</Text>
            </Box>
          ) : (
            <Spinner />
          )}
        </Box>
        <Box>{fetchWalletAddressError && <Text>Error fetching wallet address: {fetchWalletAddressError}</Text>}</Box>
        <Divider background="buttonGlass" />
        <ListSessionsView />
        <Divider background="buttonGlass" />
        <SendTransactionsView />
        <Divider background="buttonGlass" />
        <SignMessageView />
        <Divider background="buttonGlass" />
        <CallContractsView />
      </Box>
    </>
  )
}

export default App
