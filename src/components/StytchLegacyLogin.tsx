import {useStytch, useStytchSession} from "@stytch/react";
import {SetStateAction, useEffect, useRef, useState} from "react";
import {router, sequence} from "../main.tsx";
import {randomName} from "../utils/indexer.ts";
import {SessionDurationOptions} from "@stytch/vanilla-js";
import {Box, Button, Text, TextInput} from "@0xsequence/design-system";

enum StytchLoginState {
  NONE,
  AUTH_INITIATED,
  GOT_MAGIC_LINK,
  SEQUENCE_SIGN_IN,
}

export function StytchLegacyLogin() {
  const stytchClient = useStytch()
  const { session: stytchSession } = useStytchSession();
  const [state, setState] = useState(StytchLoginState.NONE)

  const [stytchEmail, setStytchEmail] = useState('')
  const stytchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (localStorage.getItem('stytch_auth') !== 'legacy') {
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('stytch_token_type') === 'magic_links' && state === StytchLoginState.NONE) {
      setState(StytchLoginState.GOT_MAGIC_LINK)
      ;(async () => {
        await stytchClient.magicLinks.authenticate(params.get('token') || '', {
          session_duration_minutes: 5,
        } as SessionDurationOptions)
      })()
    }
  }, [stytchClient, stytchSession, state]);

  useEffect(() => {
    if (localStorage.getItem('stytch_auth') !== 'legacy') {
      return
    }

    if (stytchSession && state == StytchLoginState.GOT_MAGIC_LINK) {
      setState(StytchLoginState.SEQUENCE_SIGN_IN)
      ;(async () => {
        console.log("LEGACY STYTCH FLOW")
        const tokens = stytchClient.session.getTokens()!
        const legacyIssuer = import.meta.env.VITE_STYTCH_LEGACY_ISSUER
        const res = await fetch(`${legacyIssuer}/authenticate?jwt=${tokens.session_jwt}`, { method: 'POST' })
        const resJson = await res.json()

        const walletAddress = await sequence.signIn({
          idToken: resJson.idToken,
        }, randomName())

        console.log(`Wallet address: ${walletAddress}`)

        // Clean up
        await stytchClient.session.revoke()
        setState(StytchLoginState.NONE)
        window.location.search = ''

        router.navigate('/')
      })()
    }
  }, [stytchSession, stytchClient, state]);

  const initiateStytchEmailAuth = async (email: string) => {
    localStorage.setItem('stytch_auth', 'legacy')
    setState(StytchLoginState.AUTH_INITIATED)
    await stytchClient.magicLinks.email.loginOrCreate(email, {})
  }

  return (
    <Box>
      <Box marginBottom="4">
        <Text variant="large" color="text100" fontWeight="bold">
          Stytch login (LEGACY)
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
            disabled={state !== StytchLoginState.NONE}
            required
          />
        </Box>
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
            <Button
              variant="primary"
              label="Continue"
              onClick={() => initiateStytchEmailAuth(stytchEmail)}
              data-id="continueButton"
              disabled={state !== StytchLoginState.NONE}
            />
        </Box>
        {state === StytchLoginState.AUTH_INITIATED && (
          <Box>
            <Text variant="normal" color="text80">Magic link sent to your email. Please click the link. You can close this page.</Text>
          </Box>
        )}
      </Box>
    </Box>
  )


}
