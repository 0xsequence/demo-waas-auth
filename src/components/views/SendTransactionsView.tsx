import { Box, Text, Button, TextInput, Spinner } from '@0xsequence/design-system'
import { ethers } from 'ethers'
import { SetStateAction, useEffect, useState } from 'react'
import { sequence } from '../../main'
import { isSentTransactionResponse, Network, FeeOption } from '@0xsequence/waas'
import { GetEtherBalanceArgs, SequenceIndexer } from '@0xsequence/indexer'
import { findSupportedNetwork, indexerURL } from '@0xsequence/network'
import { checkTransactionFeeOptions, TransactionFeeOptions } from './TransactionFeeOptions.tsx'

const INDEXER_API_KEY = import.meta.env.VITE_SEQUENCE_INDEXER_API_KEY

export function SendTransactionsView(props: { network?: Network }) {
  const [nativeTokenBalance, setNativeTokenBalance] = useState<bigint>()
  const [nativeTokenName, setNativeTokenName] = useState<string>('ETH')

  const [blockExplorerURL, setBlockExplorerURL] = useState<string>('')

  const [nativeTokenSendAddress, setNativeTokenSendAddress] = useState<string>('')
  const [nativeTokenSendAmount, setNativeTokenSendAmount] = useState<string>('')
  const [nativeTokenSendTxHash, setNativeTokenSendTxHash] = useState<string>()
  const [isNativeTokenSendTxInProgress, setIsNativeTokenSendTxInProgress] = useState<boolean>(false)
  const [sendTransactionError, setSendTransactionError] = useState<string>()

  const [feeOptions, setFeeOptions] = useState<FeeOption[]>()
  const [feeOption, setFeeOption] = useState<FeeOption>()
  const [feeQuote, setFeeQuote] = useState<string>()
  const [feeSponsored, setFeeSponsored] = useState<boolean>(false)

  useEffect(() => {
    fetchNativeTokenBalance()
  }, [])

  useEffect(() => {
    if (props.network) {
      const networkConfig = findSupportedNetwork(props.network.name)

      if (networkConfig) {
        // Hack to set the native token name, should ideally come from networkConfig.nativeTokenName
        const tokenName = networkConfig.name in { polygon: 1, mumbai: 1 } ? 'MATIC' : 'ETH'
        setNativeTokenName(tokenName)
        fetchNativeTokenBalance()

        if (networkConfig.blockExplorer?.rootUrl) {
          setBlockExplorerURL(networkConfig.blockExplorer?.rootUrl)
        }
      }
    }
  }, [props.network])

  const fetchNativeTokenBalance = async () => {
    if (!props.network) {
      return
    }

    const networkConfig = findSupportedNetwork(props.network.name)

    if (!networkConfig) {
      return
    }

    const address = await sequence.getAddress()
    const client = new SequenceIndexer(indexerURL(networkConfig.name), INDEXER_API_KEY)
    const res = await client.getEtherBalance({ accountAddress: address } as GetEtherBalanceArgs)

    setNativeTokenBalance(BigInt(res.balance.balanceWei))
  }

  const checkFeeOptions = async (to: string, amount: string) => {
    const resp = await checkTransactionFeeOptions({
      transactions: [
        {
          to,
          value: ethers.parseEther(amount)
        }
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

  const sendNativeToken = async (to: string, amount: string) => {
    try {
      setSendTransactionError(undefined)

      setIsNativeTokenSendTxInProgress(true)
      const tx = await sequence.sendTransaction({
        transactions: [
          {
            to,
            value: ethers.parseEther(amount)
          }
        ],
        network: props.network?.id,
        transactionsFeeOption: feeOption,
        transactionsFeeQuote: feeQuote
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
    } finally {
      setFeeQuote(undefined)
      setFeeOptions(undefined)
      setFeeOption(undefined)
      setFeeSponsored(false)
    }
  }

  return (
    <Box>
      <Text variant="normal" color="text100" fontWeight="bold">
        Native token balance: {ethers.formatEther(nativeTokenBalance || 0)} {nativeTokenName}
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
      {sendTransactionError && <Box marginTop="3">Transaction failed: {sendTransactionError}</Box>}
      <TransactionFeeOptions feeOptions={feeOptions} onSelected={setFeeOption} />
      {feeSponsored && (
        <Box marginTop="5">
          <Text variant="normal" fontWeight="bold">
            Fee options: Tx Sponsored!
          </Text>
        </Box>
      )}
      {!isNativeTokenSendTxInProgress ? (
        <Box>
          <Button
            marginTop="5"
            marginRight="2"
            label="Check fee options"
            disabled={nativeTokenSendAddress === '' && nativeTokenSendAmount === ''}
            onClick={() => checkFeeOptions(nativeTokenSendAddress, nativeTokenSendAmount)}
          />
          <Button
            marginTop="5"
            label="Send native token"
            disabled={nativeTokenSendAddress === '' && nativeTokenSendAmount === ''}
            onClick={() => sendNativeToken(nativeTokenSendAddress, nativeTokenSendAmount)}
          />
        </Box>
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
          <a href={`${blockExplorerURL}tx/${nativeTokenSendTxHash}`} target="_blank" rel="noopener noreferrer">
            {nativeTokenSendTxHash}
          </a>
        </Box>
      )}
    </Box>
  )
}
