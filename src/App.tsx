import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Divider,
  Button,
  Spinner,
} from '@0xsequence/design-system'

import { router, sequence } from './main'

import { Logo } from './components/Logo'
import { SendTransactionsView } from './components/views/SendTransactionsView'
import { ListSessionsView } from './components/views/ListSessionsView'
import { googleLogout } from '@react-oauth/google'
import { SignMessageView } from './components/views/SignMessageView'

export interface Chain {
  id: number
  name: string
  isEnabled: boolean
}

function App() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [fetchWalletAddressError, setFetchWalletAddressError] = useState<string>()

  useEffect(() => {
    sequence.getAddress().then((address: string) => {
      setWalletAddress(address)
    }).catch((e: Error) => {
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

  return (
    <>
      {/* <AnimatePresence>
      {checkYourEmailMessage && 
          <Modal>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '1.2em',
              height: '50vh'
            }}>
              {checkYourEmailMessage}
            </div>
          </Modal>
        }
      </AnimatePresence> */}
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

        <Box>
          <Box marginBottom="5">
            <Text variant="normal" color="text100" fontWeight="bold">
              Sign a message
            </Text>
          </Box>
        </Box>
        <Divider background="buttonGlass" />
        <ListSessionsView />
        <Divider background="buttonGlass" />
        <SendTransactionsView />
        <Divider background="buttonGlass" />
        <SignMessageView />
      </Box>
    </>
  )
}

export default App
