
import { Box, Text, Button, Spinner } from "@0xsequence/design-system"
import { useState } from "react"
import { sequence } from "../../main.tsx"
import {
  Network,
} from "@0xsequence/waas"

export function EOALinkView(props: {network?: Network, walletAddress?: string}) {
  const [authProofSignature, setAuthProofSignature] = useState<string>()
  const [authProofSessionId, setAuthProofSessionId] = useState<string>()
  const [verificationLink, setVerificationLink] = useState<string>()
  const [externalNonce, setExternalNonce] = useState<string>()
  const [inProgress, setInProgress] = useState<boolean>(false)
  const [sendTransactionError, setSendTransactionError] = useState<string>()

  const generateEOALink = async () => {
    try {
      setSendTransactionError(undefined)
      setInProgress(true)

      const response = await fetch('https://demo-waas-wallet-link-server.tpin.workers.dev/generateNonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress: props.walletAddress })
      })
      
      const data = await response.json()

      setVerificationLink(data.verificationUrl)
      setExternalNonce(data.nonce)

      const authProof = await sequence.sessionAuthProof({ 
        nonce: data.nonce, 
        network: props.network?.name
      })
      
      setAuthProofSessionId(authProof.data.sessionId)
      setAuthProofSignature(authProof.data.signature)

      setInProgress(false)
    } catch (e) {
      console.error(e)
      setInProgress(false)
    }
  }

  return (
    <Box>
      {sendTransactionError && (
        <Box marginTop="3">
          Transaction failed: {sendTransactionError}
        </Box>
      )}
      {!inProgress ? (
        <Box>
          <Button
            marginTop="5"
            label="Generate EOA Link"
            disabled={
              externalNonce !== undefined
            }
            onClick={() => generateEOALink() }
          />
        </Box>
      ) : (
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}
      {externalNonce && (
        <Box marginTop="3">
          <Text variant="normal" color="text100" fontWeight="bold">
            Verification Link:
          </Text>
          <br />
          <a href={`${verificationLink}?nonce=${externalNonce}&signature=${authProofSignature}&sessionId=${authProofSessionId}&chainId=${props.network?.id}`} target="_blank" rel="noopener noreferrer">
            {verificationLink}?nonce={externalNonce}&signature={authProofSignature}&sessionId={authProofSessionId}&chainId={props.network?.id}
          </a>
        </Box>
      )}
    </Box>
  )
}
