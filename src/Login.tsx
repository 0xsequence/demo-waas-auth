import { Box, Text, TextInput, Button, Spinner, useTheme, Checkbox, Divider, Modal } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { CredentialResponse, GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import AppleSignin from 'react-apple-signin-auth'

import { router, sequence } from './main'

import { PINCodeInput } from './components/PINCodeInput'
import { Logo } from './components/Logo'
import { EmailConflictWarning } from './components/views/EmailConflictWarningView.tsx'

import { randomName } from './utils/indexer'
import { useEmailAuth } from './utils/useEmailAuth.ts'
import { useSessionHash } from './utils/useSessionHash.ts'
import { useEmailAuthV2 } from './utils/useEmailAuthV2.ts'

const urlParams = new URLSearchParams(window.location.search)
const targetEnv = urlParams.get('env') ?? 'prod'

function Login() {
  const { sessionHash } = useSessionHash()
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)
  const [code, setCode] = useState<string[]>([])

  const [v2EmailLoginEnabled, setV2EmailLoginEnabled] = useState(true)

  const [isEmailConflictModalOpen, setIsEmailConflictModalOpen] = useState(false)
  const forceCreateFuncRef = useRef<(() => Promise<void>) | null>(null)

  sequence.onEmailConflict(async forceCreate => {
    forceCreateFuncRef.current = forceCreate
    setIsEmailConflictModalOpen(true)
  })

  const handleGooglePlayfabLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: tokenResponse => {
      ;(window as any).PlayFabClientSDK.LoginWithGoogleAccount(
        {
          AccessToken: tokenResponse.access_token, // This access token is generated after a user has signed into Google
          CreateAccount: true,
          TitleId: '8F854' // TODO: PUT YOUR TITLE ID HERE!
        },
        async (response, error) => {
          if (response) {
            try {
              const seqRes = await sequence.signIn(
                { playFabTitleId: '8F854', playFabSessionTicket: response.data.SessionTicket },
                randomName()
              )
              console.log('Sequence response:', seqRes)
              router.navigate('/')
            } catch (e) {
              console.error(e)
            }
          } else if (error) {
            console.log('Error: ' + JSON.stringify(error))
          }

          // if (response) {
          //   console.log(JSON.stringify(response, null, 2))
          //   try {
          //     const challenge = await sequence.initAuth({
          //       playFabTitleId: '8F854',
          //       playFabSessionTicket: response.data.SessionTicket
          //     })
          //     const res = await sequence.completeAuth(challenge, { forceCreateAccount: true })
          //     console.log('Sequence response:', res)
          //   } catch (e) {
          //     console.error(e)
          //   }
          // }
        }
      )
    }
  })

  const {
    inProgress: emailAuthInProgress,
    loading: emailAuthLoading,
    initiateAuth: initiateEmailAuth,
    sendChallengeAnswer
  } = v2EmailLoginEnabled
    ? useEmailAuthV2({
        sessionName: randomName(),
        onSuccess: async ({ wallet }) => {
          console.log(`Wallet address: ${wallet}`)
          router.navigate('/')
        }
      })
    : useEmailAuth({
        onSuccess: async idToken => {
          const walletAddress = await sequence.signIn({ idToken }, randomName())
          console.log(`Wallet address: ${walletAddress}`)
          router.navigate('/')
        }
      })

  useEffect(() => {
    ;(async () => {
      if (await sequence.isSignedIn()) {
        router.navigate('/')
      }
    })()
  }, [])

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn(
      {
        idToken: tokenResponse.credential!
      },
      randomName()
    )

    console.log(`Wallet address: ${res.wallet}`)
    console.log(`Email address: ${res.email}`)
    router.navigate('/')
  }

  const appleRedirectUri =
    'https://' + window.location.host + (window.location.host.includes('github.io') ? '/demo-waas-auth' : '')
  const handleAppleLogin = async (response: { authorization: { id_token: string } }) => {
    const res = await sequence.signIn(
      {
        idToken: response.authorization.id_token
      },
      randomName()
    )

    console.log(`Wallet address: ${res.wallet}`)
    console.log(`Email address: ${res.email}`)
    router.navigate('/')
  }

  const handleGuestLogin = async () => {
    const challenge = await sequence.signIn({ guest: true })
    const res = await sequence.completeAuth(challenge)
    console.log(`Wallet address: ${res.wallet}`)
    router.navigate('/')
  }

  return (
    <>
      <Box marginY="0" marginX="auto" paddingX="6" style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
        <Box marginBottom="16">
          <Logo />
        </Box>

        <Box gap="4">
          <Button label="Guest login" onClick={handleGuestLogin} />
        </Box>

        <Divider background="buttonGlass" />

        <Box marginTop="6">
          <Text variant="large" color="text100" fontWeight="bold">
            Email Login
          </Text>

          <Box marginTop="4">
            <Checkbox
              label="Use v2 email login"
              checked={v2EmailLoginEnabled}
              onChange={() => setV2EmailLoginEnabled(!v2EmailLoginEnabled)}
            />
          </Box>
        </Box>

        {sendChallengeAnswer ? (
          <Box flexDirection="column">
            <Box marginTop="6">
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
          <Box marginTop="5" marginBottom="4">
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

        <Divider background="buttonGlass" />

        <Box paddingY="4" gap="4" flexDirection="column" width="fit">
          {!emailAuthInProgress && !!sessionHash && (
            <>
              <Box marginBottom="4">
                <Text variant="large" color="text100" fontWeight="bold">
                  Social Login
                </Text>
              </Box>
              {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <Box>
                  <GoogleLogin
                    key={'google-' + sessionHash}
                    onSuccess={handleGoogleLogin}
                    shape="circle"
                    width={230}
                    nonce={sessionHash}
                  />
                </Box>
              )}
              {import.meta.env.VITE_APPLE_CLIENT_ID && (
                <AppleSignin
                  key={'apple-' + sessionHash}
                  authOptions={{
                    clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
                    scope: 'openid email',
                    redirectURI: appleRedirectUri,
                    usePopup: true,
                    nonce: sessionHash
                  }}
                  onError={(error: any) => console.error(error)}
                  onSuccess={handleAppleLogin}
                  uiType="dark"
                />
              )}
            </>
          )}
        </Box>

        <Divider background="buttonGlass" />

        <Box paddingY="4">
          <Box marginBottom="4">
            <Text variant="large" color="text100" fontWeight="bold">
              Playfab login
            </Text>
          </Box>

          <Box>
            <Button label="Login with Google (through Playfab)" onClick={handleGooglePlayfabLogin} />
          </Box>
        </Box>
      </Box>

      {isEmailConflictModalOpen && (
        <Modal size="small" onClose={() => setIsEmailConflictModalOpen(false)}>
          <EmailConflictWarning
            onCancel={() => setIsEmailConflictModalOpen(false)}
            onConfirm={async () => {
              setIsEmailConflictModalOpen(false)
              await forceCreateFuncRef.current?.()
            }}
          />
        </Modal>
      )}
    </>
  )
}

export default Login
