import {useStytch, useStytchSession} from "@stytch/react";
import {SetStateAction, useEffect, useRef, useState} from "react";
import {router, sequence} from "../main.tsx";
import {randomName} from "../utils/indexer.ts";
import {SessionDurationOptions} from "@stytch/vanilla-js";
import {Box, Button, Text, TextInput} from "@0xsequence/design-system";

export function StytchLogin() {
  const stytchClient = useStytch()
  const { session: stytchSession } = useStytchSession();

  const [stytchEmail, setStytchEmail] = useState('')
  const stytchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('stytch_token_type') === 'magic_links') {
      (async () => {
        if (stytchSession) {
          const tokens = stytchClient.session.getTokens()!
          console.log({ tokens })
          const walletAddress = await sequence.signIn({
            idToken: tokens.session_jwt,
          }, randomName())

          console.log(`Wallet address: ${walletAddress}`)
          router.navigate('/')
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          await stytchClient.magicLinks.authenticate(params.get('token') || '', {
            session_duration_minutes: 5,
          } as SessionDurationOptions)
        }
      })()
    }
  }, [stytchClient, stytchSession]);

  const initiateStytchEmailAuth = async (email: string) => {
    await stytchClient.magicLinks.email.loginOrCreate(email, {})
  }

  return (
    <Box>
      <Box marginBottom="4">
        <Text variant="large" color="text100" fontWeight="bold">
          Stytch login
        </Text>
      </Box>

      <Box marginTop="5" marginBottom="4">
        <Box marginTop="6">
          <TextInput
            name="stytchEmail"
            type="email"
            onChange={(ev: { target: { value: SetStateAction<string> } }) => {
              setStytchEmail(ev.target.value)
            }}
            ref={stytchInputRef}
            onKeyDown={(ev: { key: string }) => {
              if (stytchEmail && ev.key === 'Enter') {
                initiateStytchEmailAuth(stytchEmail)
              }
            }}
            value={stytchEmail}
            placeholder="hello@example.com"
            required
          />
        </Box>
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
            <Button
              variant="primary"
              label="Continue"
              onClick={() => initiateStytchEmailAuth(stytchEmail)}
              data-id="continueButton"
            />
        </Box>
      </Box>
    </Box>
  )


}
