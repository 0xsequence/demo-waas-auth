import { useEffect, useState } from 'react'
import { sequence } from '../main'

export function useEmailAuthV2({
  onSuccess,
  sessionName
}: {
  onSuccess: (res: { wallet: string; sessionId: string }) => void
  sessionName: string
}) {
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [respondWithCode, setRespondWithCode] = useState<((code: string) => Promise<void>) | null>()

  useEffect(() => {
    return sequence.onEmailAuthCodeRequired(async respondWithCode => {
      setLoading(false)
      setRespondWithCode(() => respondWithCode)
    })
  }, [sequence, setLoading, setRespondWithCode])

  const initiateAuth = async (email: string) => {
    setLoading(true)
    setInProgress(true)
    try {
      console.log('using email auth v2')
      const res = await sequence.signIn({ email }, sessionName)
      onSuccess(res)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
      setInProgress(false)
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    if (respondWithCode) {
      await respondWithCode(answer)
    }
  }

  return {
    inProgress,
    initiateAuth,
    loading,
    error,
    sendChallengeAnswer: inProgress ? sendChallengeAnswer : undefined
  }
}
