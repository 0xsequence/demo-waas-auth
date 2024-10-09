import { Box, Button, Divider, PINCodeInput, Spinner, Text, TextInput, useToast } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { Account } from '@0xsequence/waas'
import { CredentialResponse, GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import AppleSignin from 'react-apple-signin-auth'

import { sequence } from '../../main'

import { useEmailAuth } from '../../utils/useEmailAuth'
import { randomName } from '../../utils/indexer'
import { isAccountAlreadyLinkedError } from '../../utils/error'
import { AccountName } from './AccountName'

export function ListAccountsView() {
  const toast = useToast()

  const [currentAccount, setCurrentAccount] = useState<Account>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [loading, setLoading] = useState<boolean>(true)

  const [error, setError] = useState<string>()

  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)
  const [code, setCode] = useState<string[]>([])

  const {
    inProgress: emailAuthInProgress,
    loading: emailAuthLoading,
    initiateAuth: initiateEmailAuth,
    sendChallengeAnswer
  } = useEmailAuth({
    sessionName: randomName(),
    onSuccess: async ({ wallet }) => {
      console.log(`Wallet address: ${wallet}`)
    },
    linkAccount: true
  })

  const removeAccount = async (id: string) => {
    setLoading(true)
    setAccounts(undefined)
    try {
      await sequence.removeAccount(id)
      const response = await sequence.listAccounts()
      setAccounts(response.accounts)
    } catch (e: any) {
      setError(e.message)
      const response = await sequence.listAccounts()
      setAccounts(response.accounts)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const challenge = await sequence.initAuth({ idToken: tokenResponse.credential! })

    try {
      const linkResponse = await sequence.linkAccount(challenge)
      setAccounts(accounts => [...(accounts || []), linkResponse.account])
    } catch (e) {
      if (isAccountAlreadyLinkedError(e)) {
        toast({
          title: 'Account already linked',
          description: 'This account is already linked to another wallet',
          variant: 'error'
        })
      }
    }
  }

  const appleRedirectUri =
    'https://' + window.location.host
  const handleAppleLogin = async (response: { authorization: { id_token: string } }) => {
    const challenge = await sequence.initAuth({ idToken: response.authorization.id_token })
    try {
      const linkResponse = await sequence.linkAccount(challenge)
      setAccounts(accounts => [...(accounts || []), linkResponse.account])
    } catch (e) {
      if (isAccountAlreadyLinkedError(e)) {
        toast({
          title: 'Account already linked',
          description: 'This account is already linked to another wallet',
          variant: 'error'
        })
      }
    }
  }

  const handleGooglePlayfabLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: tokenResponse => {
      (window as any).PlayFabClientSDK.LoginWithGoogleAccount(
        {
          AccessToken: tokenResponse.access_token, // This access token is generated after a user has signed into Google
          CreateAccount: true,
          TitleId: import.meta.env.VITE_PLAYFAB_TITLE_ID
        },
        async (response?: { data: { SessionTicket: string } }, error?: Error) => {
          if (response) {
            try {
              const challange = await sequence.initAuth({
                playFabTitleId: import.meta.env.VITE_PLAYFAB_TITLE_ID,
                playFabSessionTicket: response.data.SessionTicket
              })

              const linkResponse = await sequence.linkAccount(challange)

              console.log('playfab account', JSON.stringify(linkResponse.account, null, 2))

              setAccounts(accounts => [...(accounts || []), linkResponse.account])
            } catch (e) {
              console.error(e)

              if (isAccountAlreadyLinkedError(e)) {
                toast({
                  title: 'Account already linked',
                  description: 'This account is already linked to another wallet',
                  variant: 'error'
                })
              }
            }
          } else if (error) {
            console.log('Error: ' + JSON.stringify(error))
          }
        }
      )
    }
  })

  useEffect(() => {
    sequence
      .listAccounts()
      .then(response => {
        setAccounts(response.accounts)

        if (response.currentAccountId) {
          setCurrentAccount(response.accounts.find(account => account.id === response.currentAccountId))
        }

        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [emailAuthInProgress])

  return (
    <Box>
      <Divider background="buttonGlass" />
      <Box marginBottom="5" gap="4" flexDirection="column">
        <Text variant="normal" color="text100" fontWeight="bold">
          Your connected (linked) accounts
        </Text>
        {accounts && (
          <>
            {accounts.map(a => (
              <Box key={a.id} flexDirection="row" alignItems="center" gap="2">
                <Text variant="normal" color="text100">
                  <AccountName acc={a} />
                </Text>
                {a.id !== currentAccount?.id && <Button size="xs" label="Remove" onClick={() => removeAccount(a.id)} />}
                {a.id === currentAccount?.id && (
                  <Box>
                    <Text variant="small" color="text100">
                      (Account you logged in with)
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
        {loading && <Spinner />}
      </Box>

      <Divider background="buttonGlass" />

      <Box flexDirection="column" gap="2" width="fit">
        <Text variant="large" color="text100" fontWeight="bold" marginBottom="5">
          Connect (link) another login method
        </Text>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && <GoogleLogin onSuccess={handleGoogleLogin} shape="circle" width={230} />}
        <Divider background="buttonGlass" width="full" />
        {import.meta.env.VITE_APPLE_CLIENT_ID && (
          <AppleSignin
            authOptions={{
              clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
              scope: 'openid email',
              redirectURI: appleRedirectUri,
              usePopup: true
            }}
            onError={(error: any) => console.error(error)}
            onSuccess={handleAppleLogin}
            uiType="dark"
          />
        )}

        {import.meta.env.VITE_PLAYFAB_TITLE_ID && (
          <>
            <Divider background="buttonGlass" width="full" />
            <Box marginTop="2">
              <Box>
                <Button label="Login with Google (through Playfab)" onClick={handleGooglePlayfabLogin} />
              </Box>
            </Box>
          </>
        )}

        <Divider background="buttonGlass" width="full" />

        <Box marginTop="2">
          <Text variant="normal" color="text100" fontWeight="bold">
            Email
          </Text>
        </Box>

        {sendChallengeAnswer ? (
          <Box flexDirection="column">
            <Box marginTop="3">
              <Text marginTop="5" variant="normal" color="text80">
                Enter code received in email.
              </Text>
            </Box>
            <Box marginTop="4">
              <PINCodeInput value={code} digits={6} onChange={setCode} />
            </Box>

            <Box gap="2" marginY="4">
              {emailAuthLoading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  disabled={code.includes('')}
                  label="Verify"
                  onClick={() => sendChallengeAnswer(code.join(''))}
                  data-id="verifyButton"
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box marginBottom="4">
            <Text variant="normal" color="text80">
              Enter your email to recieve a code to login and create your wallet. <br />
              Please check your spam folder if you don't see it in your inbox.
            </Text>

            <Box marginTop="6">
              <TextInput
                name="email"
                type="email"
                onChange={(ev: { target: { value: SetStateAction<string> } }) => {
                  setEmail(ev.target.value)
                }}
                ref={inputRef}
                onKeyDown={(ev: { key: string }) => {
                  if (email && ev.key === 'Enter') {
                    initiateEmailAuth(email)
                  }
                }}
                onBlur={() => setEmailWarning(!!email && !isEmailValid)}
                value={email}
                placeholder="hello@example.com"
                required
                data-id="loginEmail"
              />
              {showEmailWarning && (
                <Text as="p" variant="small" color="negative" marginY="2">
                  Invalid email address
                </Text>
              )}
            </Box>
            <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
              {emailAuthLoading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  disabled={!isEmailValid}
                  label="Continue"
                  onClick={() => initiateEmailAuth(email)}
                  data-id="continueButton"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
      {error && (
        <Text variant="normal" color="text100" fontWeight="bold">
          Error loading accounts: {error}
        </Text>
      )}
    </Box>
  )
}
