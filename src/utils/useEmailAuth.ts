import { useState } from 'react'
import { sequence } from '../main'


export function useEmailAuth({ onSuccess, sessionName }: { onSuccess: (res: { wallet: string, sessionId: string }) => void, sessionName: string }) {
  const [email, setEmail]  = useState("")
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [instance, setInstance] = useState('')

  const initiateAuth = async (email: string) => {
    setLoading(true)

    try {
      const instance = await sequence.initiateEmailAuth(email)
      setInstance(instance!)
      setEmail(email)
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    setLoading(true)

    try {
      const res = await sequence.completeEmailAuth({ challenge: instance, answer, email, sessionName })
      onSuccess(res)
    } catch (e: any) {
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return {
    inProgress: loading || !!instance,
    loading,
    error,
    initiateAuth,
    sendChallengeAnswer: instance ? sendChallengeAnswer : undefined,
  }
}
