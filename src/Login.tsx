import { Box, Text, TextInput, Button, Spinner } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'

import { router, sequence } from './main'

import { PINCodeInput } from './components/PINCodeInput'
import { Logo } from './components/Logo'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { randomName } from './utils/indexer'
import { useEmailAuth } from "./utils/useEmailAuth.ts";

function Login() {
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)
  const [code, setCode] = useState<string[]>([])
  const [signingIn, setSigningIn] = useState(false)

  const {
      inProgress: emailAuthInProgress,
      loading: emailAuthLoading,
      initiateAuth: initiateEmailAuth,
      sendChallengeAnswer,
  } = useEmailAuth({
      onSuccess: async (idToken) => {
          setSigningIn(true)
          const walletAddress = await sequence.signIn({ idToken }, randomName())
          console.log(`Wallet address: ${walletAddress}`)
          router.navigate('/')
      },
  })

  useEffect(() => {
    (async () => {
      if (await sequence.isSignedIn()) {
        router.navigate('/')
      }
    })()
  }, [])

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const walletAddress = await sequence.signIn({
      idToken: tokenResponse.credential!
    }, randomName())

    console.log(`Wallet address: ${walletAddress}`)
    router.navigate('/')
  }

  return (
    <Box marginY="0" marginX="auto" paddingX="6" style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
      <Box marginBottom="16">
        <Logo />
      </Box>

      <Box>
        <Text variant="large" color="text100" fontWeight="bold">
          Email Login
        </Text>
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
            {emailAuthLoading || signingIn ? (
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

      <hr/>

      {!emailAuthInProgress && (<>
        <Box>
          <Text variant="large" color="text100" fontWeight="bold">
            Social Login
          </Text>
        </Box>
        <GoogleLogin onSuccess={handleGoogleLogin} shape="circle" width={230} />
      </>)}

    </Box>
  )
}

export default Login
