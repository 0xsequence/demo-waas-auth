import { useState } from 'react'
import { sequence } from '../main'
import { Challenge } from '@0xsequence/waas';


export function useEmailAuthV2({ onSuccess, sessionName }: { onSuccess: (res: { wallet: string, sessionId: string }) => void, sessionName: string }) {
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const initiateAuth = async (email: string) => {
    setLoading(true)

    try {
      const challenge = await sequence.initAuth({ email })
      setChallenge(challenge)
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    if (!challenge) {
      throw new Error('email challenge not started yet')
    }

    setLoading(true)

    try {
      const res = await sequence.completeAuth(challenge.withAnswer(answer), { sessionName })
      onSuccess(res)
    } catch (e: any) {
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return {
    inProgress: loading || !!challenge,
    loading,
    error,
    initiateAuth,
    sendChallengeAnswer: challenge ? sendChallengeAnswer : undefined,
  }
}
