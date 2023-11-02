import { useMemo, useState } from 'react'
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand, RespondToAuthChallengeCommand, SignUpCommand,
  UserLambdaValidationException
} from '@aws-sdk/client-cognito-identity-provider'

interface EmailAuthConfig {
  region: string
  clientId: string
  onSuccess: (idToken: string) => void
}


export function useEmailAuth({ region, clientId, onSuccess }: EmailAuthConfig) {
  const [email, setEmail]  = useState("")
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [challengeSession, setChallengeSession] = useState('')

  const client = useMemo(
    () => new CognitoIdentityProviderClient({ region }),
    [region],
  )

  const signUp = async (email: string) => {
    const cmd = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: 'aB1%' + getRandomString(14),
      UserAttributes: [{Name: 'email', Value: email}],
    })
    await client.send(cmd)
  }

  const initiateAuth = (email: string) => {
    const cmd = new InitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
      }
    })
    setEmail(email)
    setLoading(true)

    ;(async () => {
      while (true) {
        try {
          const res = await client.send(cmd)
          if (!res.Session) {
            throw new Error("response session is empty")
          }
          setChallengeSession(res.Session)
          setLoading(false)
          break
        } catch (e) {
          if (e instanceof UserLambdaValidationException) {
            if (e.message.includes("user not found")) {
              await signUp(email)
              continue
            }
          }
          setError(e)
          setLoading(false)
          break
        }
      }
    })()
  }

  const sendChallengeAnswer = (answer: string) => {
    const cmd = new RespondToAuthChallengeCommand({
      ClientId: clientId,
      Session: challengeSession,
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: { USERNAME: email, ANSWER: answer },
    })
    setLoading(true)

    ;(async () => {
      try {
        const res = await client.send(cmd)
        if (!res.AuthenticationResult) {
          throw new Error('AuthenticationResult is empty')
        }
        onSuccess(res.AuthenticationResult.IdToken!)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    })()
  }

  return {
    inProgress: loading || !!challengeSession,
    loading,
    error,
    initiateAuth,
    sendChallengeAnswer: challengeSession ? sendChallengeAnswer : undefined,
  }
}

function getRandomString(len: number) {
  const randomValues = new Uint8Array(len);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues).map(intToHex).join('');
}

function intToHex(nr: number) {
  return nr.toString(16).padStart(2, '0');
}
