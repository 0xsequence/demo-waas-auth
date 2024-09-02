import { Box, Text, Button, TextInput, Spinner } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useState } from 'react'
import { sequence } from '../../main'
import { delayedEncode, FeeOption, isSentTransactionResponse, Network } from '@0xsequence/waas'
import { checkTransactionFeeOptions, TransactionFeeOptions } from './TransactionFeeOptions.tsx'
import { findSupportedNetwork } from '@0xsequence/network'

export function CallContractsView(props: { network?: Network }) {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [contractAbi, setContractAbi] = useState<string>('')
  const [contractMethod, setContractMethod] = useState<string>('')
  const [contractMethodArgs, setContractMethodArgs] = useState<string>('')
  const [transactionHash, setTransactionHash] = useState<string>()
  const [inProgress, setInProgress] = useState<boolean>(false)
  const [sendTransactionError, setSendTransactionError] = useState<string>()

  const [feeOptions, setFeeOptions] = useState<FeeOption[]>()
  const [feeOption, setFeeOption] = useState<FeeOption>()
  const [feeQuote, setFeeQuote] = useState<string>()
  const [feeSponsored, setFeeSponsored] = useState<boolean>(false)

  const [blockExplorerURL, setBlockExplorerURL] = useState<string>('')

  useEffect(() => {
    if (props.network) {
      const networkConfig = findSupportedNetwork(props.network.name)
      if (networkConfig?.blockExplorer?.rootUrl) {
        setBlockExplorerURL(networkConfig.blockExplorer?.rootUrl)
      }
    }
  }, [props.network])

  const checkFeeOptions = async () => {
    const resp = await checkTransactionFeeOptions({
      transactions: [
        delayedEncode({
          to: contractAddress,
          abi: contractAbi,
          func: contractMethod,
          args: JSON.parse(contractMethodArgs),
          value: '0'
        })
      ],
      network: props.network
    })

    if (resp.feeQuote && resp.feeOptions) {
      setFeeOptions(resp.feeOptions)
      setFeeQuote(resp.feeQuote)

      console.log('feeOptions', resp)
      return
    }

    setFeeSponsored(true)
    console.log('tx sponsored')
  }

  const callContract = async () => {
    try {
      setSendTransactionError(undefined)
      setInProgress(true)

      const tx = await sequence.callContract({
        network: props.network?.id,
        to: contractAddress,
        abi: contractAbi,
        func: contractMethod,
        args: JSON.parse(contractMethodArgs),
        value: 0,
        transactionsFeeOption: feeOption,
        transactionsFeeQuote: feeQuote
      })

      if (isSentTransactionResponse(tx)) {
        setTransactionHash(tx.data.txHash)
      } else {
        setSendTransactionError(tx.data.error)
      }

      setInProgress(false)
    } catch (e) {
      console.error(e)
      setInProgress(false)
    }
  }

  return (
    <Box>
      <Box marginTop="5">
        <TextInput
          name="callContractAddress"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setContractAddress(ev.target.value)
          }}
          value={contractAddress}
          placeholder="Contract address 0x..."
          required
          data-id="nativeTokenSendAddress"
        />
      </Box>
      <Box marginTop="5">
        <TextInput
          name="callContractAbi"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setContractAbi(ev.target.value)
          }}
          value={contractAbi}
          placeholder="Contract ABI or function ABI, e.g. [{...}] or [{...}, {...}] or transfer(address,uint256)"
          required
          data-id="nativeTokenSendAmount"
        />
      </Box>
      <Box marginTop="5">
        <TextInput
          name="callContractMethod"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setContractMethod(ev.target.value)
          }}
          value={contractMethod}
          placeholder="Method name, e.g. transfer"
          required
          data-id="nativeTokenSendAmount"
        />
      </Box>
      <Box marginTop="5">
        <TextInput
          name="callContractArgs"
          type="text"
          onChange={(ev: { target: { value: SetStateAction<string> } }) => {
            setContractMethodArgs(ev.target.value)
          }}
          value={contractMethodArgs}
          placeholder={`Method args, e.g. [0x..., 1000] or named { "to": "0x...", "amount": "1000" }`}
          required
          data-id="nativeTokenSendAmount"
        />
      </Box>

      <TransactionFeeOptions feeOptions={feeOptions} onSelected={setFeeOption} />
      {feeSponsored && (
        <Box marginTop="5">
          <Text variant="normal" fontWeight="bold">
            Fee options: Tx Sponsored!
          </Text>
        </Box>
      )}

      {sendTransactionError && <Box marginTop="3">Transaction failed: {sendTransactionError}</Box>}
      {!inProgress ? (
        <Box>
          <Button
            marginTop="5"
            marginRight="2"
            label="Check fee options"
            disabled={contractAddress === '' && contractAbi === '' && contractMethod === '' && contractMethodArgs === ''}
            onClick={() => checkFeeOptions()}
          />
          <Button
            marginTop="5"
            label="Call contract"
            disabled={contractAddress === '' && contractAbi === '' && contractMethod === '' && contractMethodArgs === ''}
            onClick={() => callContract()}
          />
        </Box>
      ) : (
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}
      {transactionHash && (
        <Box marginTop="3">
          <Text variant="normal" color="text100" fontWeight="bold">
            Send native token transaction hash:
          </Text>
          <br />
          <a href={`${blockExplorerURL}tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </Box>
      )}
    </Box>
  )
}
