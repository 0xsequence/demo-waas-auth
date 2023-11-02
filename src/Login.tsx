import { Box, Text, TextInput, Button, Spinner } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'

import { router, sequence } from './main'

import { PINCodeInput } from './components/PINCodeInput'
import { Logo } from './components/Logo'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { randomName } from './utils/indexer'

const host = import.meta.env.VITE_API_HOST

function Login() {
  const handlePasswordlessLogin = async (email: string) => {
    //   try {
    //   setShowLoader(true)

    //   const payload = await sequence.signIn()

    //   const sendPasswordlessLoginLink = await fetch(host + '/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ email, payload })
    //   })

    //   const response = await sendPasswordlessLoginLink.json()

    //   // feedback response.sequence to sequence
    //   await sequence.completeSignIn(response.sequence)

    //   if (response.message) {
    //     setLoginCodeSentMessage(response.message)
    //   }
    // } catch (e) {
    //   console.error(e)
    //   localStorage.clear()
    // }

    // setShowLoader(false)
  }

  const verifyPasswordlessLogin = async (email: string, code: string) => {
    setShowVerifyLoader(true)
    const verifyPasswordlessLoginLink = await fetch(host + '/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    })

    const response = await verifyPasswordlessLoginLink.json()

    setShowVerifyLoader(false)

    if (response.token) {
      localStorage.setItem('jwt', response.token)
      localStorage.setItem('email', email)
      router.navigate('/')
    }
  }

  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)

  const [showLoader, setShowLoader] = useState(false)
  const [showVerifyLoader, setShowVerifyLoader] = useState(false)

  const [loginCodeSentMessage, setLoginCodeSentMessage] = useState<string | undefined>(undefined)

  const [code, setCode] = useState<string[]>([])

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

      {loginCodeSentMessage ? (
        <Box flexDirection="column">
          <Box marginTop="6">
            <Text marginTop="5" variant="normal" color="text80">
              {loginCodeSentMessage}
            </Text>
          </Box>
          <Box marginTop="4">
            <PINCodeInput value={code} digits={6} onChange={setCode} />
          </Box>

          <Box gap="2" marginY="4">
            {showVerifyLoader ? (
              <Spinner />
            ) : (
              <Button
                variant="primary"
                disabled={code.includes('')}
                label="Verify"
                onClick={() => verifyPasswordlessLogin(email, code.join(''))}
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
                  handlePasswordlessLogin(email)
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
            {showLoader ? (
              <Spinner />
            ) : (
              <Button
                variant="primary"
                disabled={!isEmailValid}
                label="Continue"
                onClick={() => handlePasswordlessLogin(email)}
                data-id="continueButton"
              />
            )}
          </Box>
        </Box>
      )}

      <hr/>

      {!loginCodeSentMessage && (<>
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
