import { useState } from 'react'
import { sequence } from '../main'


export function useEmailAuth({ onSuccess }: { onSuccess: (idToken: string) => void }) {
  const [email, setEmail]  = useState("")
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [instance, setInstance] = useState('')

  const initiateAuth = async (email: string) => {
    setLoading(true)

    try {
      const { instance } = await sequence.email.initiateAuth({ email })
      setInstance(instance)
      setEmail(email)
    } catch (e: any) {
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    setLoading(true)

    try {
      const sessionHash = await sequence.getSessionHash()
      const { idToken } = await sequence.email.finalizeAuth({ instance, answer, email, sessionHash })
      onSuccess(idToken)
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
