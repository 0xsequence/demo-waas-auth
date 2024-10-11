import { useEffect, useState } from 'react'
import { Box, Text, Divider, Button, Spinner, Modal, Collapsible, ExternalLinkIcon } from '@0xsequence/design-system'

import { router, sequence } from './main'

import { Logo } from './components/Logo'
import { SendTransactionsView } from './components/views/SendTransactionsView'
import { ListSessionsView } from './components/views/ListSessionsView'
import { googleLogout } from '@react-oauth/google'
import { SignMessageView } from './components/views/SignMessageView'
import { CallContractsView } from './components/views/CallContractsView'
import { AnimatePresence } from 'framer-motion'
import { PINCodeInput } from './components/PINCodeInput'
import { SendERC20View } from './components/views/SendERC20View'
import { SendERC1155View } from './components/views/SendERC1155View'
import { NetworkSwitch } from './components/NetworkSwitch.tsx'
import { accountToName, ListAccountsView } from './components/views/ListAccountsView.tsx'
import { Account, IdentityType, Network } from '@0xsequence/waas'

function App() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [fetchWalletAddressError, setFetchWalletAddressError] = useState<string>()

  const [sessionValidationCode, setSessionValidationCode] = useState<string[]>([])
  const [isValidateSessionPending, setIsValidateSessionPending] = useState(false)
  const [isFinishValidateSessionPending, setIsFinishValidateSessionPending] = useState(false)

  const [network, setNetwork] = useState<undefined | Network>()

  const [currentAccount, setCurrentAccount] = useState<Account>()

  useEffect(() => {
    sequence
      .getAddress()
      .then((address: string) => {
        setWalletAddress(address)
      })
      .catch((e: Error) => {
        setFetchWalletAddressError(e.message)
      })

    sequence.listAccounts().then(response => {
      if (response.currentAccountId) {
        setCurrentAccount(response.accounts.find(account => account.id === response.currentAccountId))
      }
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
    if (code.length === 6) {
      setIsFinishValidateSessionPending(true)
      sequence.finishValidateSession(code)
    }
  }, [sessionValidationCode])

  useEffect(() => {
    const removeCallback = sequence.onValidationRequired(() => {
      setIsValidateSessionPending(true)

      sequence.waitForSessionValid(600 * 1000, 4000).then((isValid: boolean) => {
        console.log('isValid', isValid)
        setSessionValidationCode([])
        setIsValidateSessionPending(false)
        setIsFinishValidateSessionPending(false)
      })
    })
    return () => {
      removeCallback.then((cb: any) => cb())
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {isValidateSessionPending && (
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
          {currentAccount && (
            <Box flexDirection="column" gap="2">
              <Text marginTop="1" variant="normal" color="text100">
                {currentAccount.type === IdentityType.Guest
                  ? 'Guest account'
                  : `Logged in with account type ${currentAccount.type}`}{' '}
              </Text>
              {currentAccount.type !== IdentityType.Guest && accountToName(currentAccount)}
            </Box>
          )}

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

        <Box marginBottom="5">
          <Text variant="normal" color="text100" fontWeight="normal">
            {walletAddress ? (
              <Box>
                <Text>{walletAddress}</Text>
              </Box>
            ) : (
              <Spinner />
            )}
          </Text>
        </Box>

        <Box>{fetchWalletAddressError && <Text>Error fetching wallet address: {fetchWalletAddressError}</Text>}</Box>
        <Divider background="buttonGlass" />
        <ListSessionsView />

        <Divider background="buttonGlass" />

        <Box marginBottom="5">
          <NetworkSwitch onNetworkChange={setNetwork}></NetworkSwitch>
        </Box>

        <Divider background="buttonGlass" />

        <Collapsible marginY={'3'} label="Send native token transaction">
          <Divider background="buttonGlass" />
          <SendTransactionsView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Send ERC20 transaction">
          <Divider background="buttonGlass" />
          <SendERC20View network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Send ERC1155 transaction">
          <Divider background="buttonGlass" />
          <SendERC1155View network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Sign a message">
          <Divider background="buttonGlass" />
          <SignMessageView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Call contracts">
          <Divider background="buttonGlass" />
          <CallContractsView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="External Wallet Linking Demo">
          <Text
            as="a"
            variant="medium"
            color="text100"
            href="https://demo-waas-wallet-link.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to demo
            <ExternalLinkIcon position="relative" top="1" marginLeft="1" />
          </Text>
        </Collapsible>
        <ListAccountsView />

        <Button label="Adopt child wallet" onClick={async () => {
          await sequence.adoptChildWallet({
            network: '11155111',
            adopter: '0x3395593Dca1D2C8DE7f37EE0ae10614a1DCa7Bab',
            message: 'adoption-signal-123',
            signature: '0x00050000001303ece54dbc5b6287842d865a7a09e1006d7821b36e0a58d45e34266407b67695cf040000ba03f91e236c215450146243890c9c0390c04bf674a34c2f05c4b5a5ed050f8180a7040000950103f27e71edb28694b72bbba2ed2a72523423e651680400007b0203761f5e29944d79d76656323f106cf2efbf5f09e900006201000100000000000105a35868ea4b1fdbf1fc13bcfe0320c9454fc8ba49560954dcfcfd534542a9687350f2f9bcb9f6976b692e73de09b473f00a6c594b0b79f5c0b46c2ad4657ea81b02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e61030339810f050c3f607e773b3f6283fae5a67ad01b31b35416053dbe672797b25f340400008e03eda3ba609d0a089cc942e4f1b1f13e4944f24102d4ec21732019a26edeaa1389040000690307c50997cca071ab3a748bb09dc87d6fc2f916ca0b58dfd860826a99266b88ae040000440002a85390677e04b20177a2f0bb74cf56ec999d30a77187325a47ba016240c53be448979296deab341d888287d7f8c27b71d59a977d4404058ea329936973c45f761c02',
          })
        }} />
      </Box>
    </>
  )
}

export default App
