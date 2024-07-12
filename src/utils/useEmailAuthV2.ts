import { useEffect, useState } from 'react'
import { sequence } from '../main'
import { Challenge } from '@0xsequence/waas'

export function useEmailAuthV2({
  onSuccess,
  sessionName,
  federateAccount = false
}: {
  onSuccess: (res: { wallet: string; sessionId: string }) => void
  sessionName: string
  federateAccount?: boolean
}) {
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [respondWithCode, setRespondWithCode] = useState<((code: string) => Promise<void>) | null>()

  const [challenge, setChallenge] = useState<Challenge | undefined>()

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
      if (federateAccount) {
        const challenge = await sequence.initAuth({ email })
        setChallenge(challenge)
        setLoading(false)
      } else {
        const res = await sequence.signIn({ email }, sessionName)
        onSuccess(res)
      }
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      if (!federateAccount) {
        setLoading(false)
        setInProgress(false)
      }
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    if (federateAccount && challenge) {
      //completeAuth(challenge.withAnswer(answer), { sessionName })
      await sequence.federateAccount(challenge.withAnswer(answer))
      setLoading(false)
      setInProgress(false)
      return
    }
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
