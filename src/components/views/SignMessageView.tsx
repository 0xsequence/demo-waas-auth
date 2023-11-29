import { Box, Text, Button, TextInput } from "@0xsequence/design-system"
import { SetStateAction, useState } from "react"
import { signer } from '../../main'

export function SignMessageView() {
  const [messageToSign, setMessageToSign] = useState<string>('')
  const [signature, setSignature] = useState<string>()

  const signMessage = async () => {
    const signature = await signer.signMessage(messageToSign)
    setSignature(signature)
  }

  return (
    <Box>
      <Box marginBottom="5">
        <Text variant="normal" color="text100" fontWeight="bold">
          Sign message
        </Text>
      </Box>
      <TextInput
        name="signMessageText"
        type="text"
        onChange={(ev: { target: { value: SetStateAction<string> } }) => {
          setMessageToSign(ev.target.value)
          if (signature != '') {
            setSignature('')
          }
        }}
        value={messageToSign}
        placeholder="Enter a message to sign"
        required
        data-id="signMessageInput"
      />
      <Button
        marginTop="5"
        label="Sign message"
        disabled={messageToSign === ''}
        onClick={() => signMessage()}
      />
      {signature && signature !== '' && (
        <Box flexDirection="column" marginTop="5">
          <Text variant="normal" color="text100" fontWeight="bold">
            Signature for {messageToSign}:
          </Text>
          <Box>
            <Text as="p" wordBreak="break-word">
              {signature}
            </Text>
          </Box>
          {/* <Button marginY="5" label="Validate" onClick={() => validateSignature(selectedChain!.id, messageToSign, signature)} />
          {isValidSignature !== undefined && <Text>isValid: {String(isValidSignature)}</Text>} */}
        </Box>
      )}
    </Box>
  )
}
