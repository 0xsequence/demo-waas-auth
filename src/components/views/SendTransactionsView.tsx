import { Box, Text, Button, TextInput, Spinner } from "@0xsequence/design-system"
import { ethers } from "ethers"
import { SetStateAction, useEffect, useState } from "react"
import { node, sequence } from "../../main"
import { isSentTransactionResponse } from "@0xsequence/waas"

export function SendTransactionsView() {
  const [nativeTokenBalance, setNativeTokenBalance] = useState<ethers.BigNumber>()
  const [nativeTokenSendAddress, setNativeTokenSendAddress] = useState<string>('')
  const [nativeTokenSendAmount, setNativeTokenSendAmount] = useState<string>('')
  const [nativeTokenSendTxHash, setNativeTokenSendTxHash] = useState<string>()
  const [isNativeTokenSendTxInProgress, setIsNativeTokenSendTxInProgress] = useState<boolean>(false)
  const [sendTransactionError, setSendTransactionError] = useState<string>()

  useEffect(() => { fetchNativeTokenBalance() }, [])

  const fetchNativeTokenBalance = async () => {
    const address = sequence.getAddress()
    setNativeTokenBalance(await node.getBalance(address))
  }

  const sendNativeToken = async (to: string, amount: string) => {
    try {
      setSendTransactionError(undefined)

      setIsNativeTokenSendTxInProgress(true)
      const tx = await sequence.sendTransaction({
        transactions: [{
          to, value: ethers.utils.parseEther(amount)
        }]
      })

      if (isSentTransactionResponse(tx)) {
        setNativeTokenSendTxHash(tx.data.txHash)
      } else {
        setSendTransactionError(tx.data.error)
      }

      setIsNativeTokenSendTxInProgress(false)
    } catch (e) {
      console.error(e)
      setIsNativeTokenSendTxInProgress(false)
    }
  }
  
  return (
    <Box>
      <Text variant="normal" fontWeight="bold">
        Native token balance: {ethers.utils.formatEther(nativeTokenBalance || 0)} MATIC
      </Text>
      <Button marginLeft="2" size="xs" label="Fetch" onClick={fetchNativeTokenBalance} />
      <Box marginTop="5">
        <TextInput
          name="sendNativeTokenTo"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setNativeTokenSendAddress(ev.target.value)
          }}
          value={nativeTokenSendAddress}
          placeholder="To address 0x..."
          required
          data-id="nativeTokenSendAddress"
        />
      </Box>
      <Box marginTop="5">
        <TextInput
          name="sendNativeTokenAmount"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setNativeTokenSendAmount(ev.target.value)
          }}
          value={nativeTokenSendAmount}
          placeholder="Amount"
          required
          data-id="nativeTokenSendAmount"
        />
      </Box>
      {sendTransactionError && (
        <Box marginTop="3">
          Transaction failed: {sendTransactionError}
        </Box>
      )}
      {!isNativeTokenSendTxInProgress ? (
        <Button
          marginTop="5"
          label="Send native token"
          disabled={nativeTokenSendAddress === '' && nativeTokenSendAmount === ''}
          onClick={() => sendNativeToken(nativeTokenSendAddress, nativeTokenSendAmount)}
        />
      ) : (
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}
      {nativeTokenSendTxHash && (
        <Box marginTop="3">
          <Text variant="normal" color="text100" fontWeight="bold">
            Send native token transaction hash:
          </Text>
          <br />
          <a href={`https://polygonscan.com/tx/${nativeTokenSendTxHash}`} target="_blank" rel="noopener noreferrer">
            {nativeTokenSendTxHash}
          </a>
        </Box>
      )}
    </Box>
  )
}
