import { ReactNode, useEffect, useState } from 'react'
import { Box, Text, Button, TextInput, Spinner } from '@0xsequence/design-system'
import { ethers } from 'ethers'
import { sequence } from '../../main'
import { erc1155, FeeOption, isSentTransactionResponse, Network } from '@0xsequence/waas'
import { GetTokenBalancesReturn, SequenceIndexer } from '@0xsequence/indexer'
import { TransactionFeeOptions } from './TransactionFeeOptions.tsx'
import { checkTransactionFeeOptions } from './checkTransactionFeeOptions.tsx'
import { findSupportedNetwork } from '@0xsequence/network'
import { SendERC1155RowView } from './SendERC1155RowView.tsx'
import { safeEventStringSetter } from '../../utils/safeEventStringSetter.ts'

const INDEXER_API_KEY = import.meta.env.VITE_SEQUENCE_INDEXER_API_KEY

export type SelectOption = {
  className?: string
  disabled?: boolean
  label: string | ReactNode
  value: string
}

interface TokenEntry {
  tokenId: string
  amount: string
}

export function SendERC1155View(props: { network?: Network }) {
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [tokenEntries, setTokenEntries] = useState<TokenEntry[]>([])
  const [destinationAddress, setDestinationAddress] = useState<string>('')
  const [transactionHash, setTransactionHash] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<GetTokenBalancesReturn | undefined>(undefined)

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

  const addTokenEntry = () => {
    setTokenEntries([...tokenEntries, { tokenId: '', amount: '' }])
  }

  const fetchOptions = async () => {
    if (!INDEXER_API_KEY) {
      console.error('Missing INDEXER_API_KEY, ERC1155 token metadata will not be fetched')
      return
    }

    if (!tokenAddress) {
      return
    }

    if (!props.network) {
      return
    }

    const network = props.network.name
    const client = new SequenceIndexer('https://' + network + '-indexer.sequence.app', INDEXER_API_KEY)

    // pass aything you would like
    const contractAddress = tokenAddress
    const accountAddress = await sequence.getAddress()
    const includeMetadata = true

    // Fetch tokens and collectibles owned by any wallet
    setOptions(
      await client.getTokenBalances({
        contractAddress,
        accountAddress,
        includeMetadata
      })
    )
  }

  useEffect(() => {
    fetchOptions()
  }, [tokenAddress])

  const updateTokenEntry = (index: number, value: TokenEntry) => {
    const newEntries = [...tokenEntries]
    newEntries[index] = value
    setTokenEntries(newEntries)
  }

  const removeTokenEntry = (index: number) => {
    const newEntries = [...tokenEntries]
    newEntries.splice(index, 1)
    setTokenEntries(newEntries)
  }

  const checkFeeOptions = async () => {
    const resp = await checkTransactionFeeOptions({
      transactions: [
        erc1155({
          to: destinationAddress,
          token: tokenAddress,
          values: tokenEntries.map(entry => ({
            id: entry.tokenId,
            amount: ethers.parseUnits(entry.amount, 0)
          }))
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

  const sendTokens = async () => {
    try {
      setError('')
      setIsLoading(true)

      const tx = await sequence.sendERC1155({
        to: destinationAddress,
        token: tokenAddress,
        values: tokenEntries.map(entry => ({
          id: entry.tokenId,
          amount: ethers.parseUnits(entry.amount, 0)
        })),
        network: props.network?.id,
        transactionsFeeOption: feeOption,
        transactionsFeeQuote: feeQuote
      })

      if (isSentTransactionResponse(tx)) {
        setTransactionHash(tx.data.txHash)
      } else {
        setError(tx.data.error)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Box marginBottom="5">
        <TextInput
          type="text"
          value={tokenAddress}
          onChange={safeEventStringSetter(setTokenAddress)}
          placeholder="Token Contract Address"
        />
      </Box>
      <Box marginBottom="5">
        <Button label="Fetch metadata" onClick={() => fetchOptions()} />
      </Box>
      {tokenEntries.map((_, index) => (
        <Box key={index} marginBottom="3">
          <SendERC1155RowView
            index={index}
            options={options}
            onChange={(index, tokenId, amount) => updateTokenEntry(index, { tokenId, amount })}
            removeTokenEntry={removeTokenEntry}
          />
        </Box>
      ))}

      <Button label="Add Token" onClick={addTokenEntry} />

      <Box marginTop="5">
        <TextInput
          type="text"
          value={destinationAddress}
          onChange={safeEventStringSetter(setDestinationAddress)}
          placeholder="Destination Address"
        />
      </Box>

      {error && (
        <Box marginTop="3">
          <Text color="error">Error: {error}</Text>
        </Box>
      )}

      <TransactionFeeOptions feeOptions={feeOptions} onSelected={setFeeOption} />
      {feeSponsored && (
        <Box marginTop="5">
          <Text variant="normal" fontWeight="bold">
            Fee options: Tx Sponsored!
          </Text>
        </Box>
      )}

      {!isLoading ? (
        <Box>
          <Button
            marginTop="5"
            marginRight="2"
            label="Check fee options"
            disabled={tokenAddress === '' && destinationAddress === '' && tokenEntries.length !== 0}
            onClick={() => checkFeeOptions()}
          />
          <Button marginTop="5" label="Send Tokens" onClick={sendTokens} />
        </Box>
      ) : (
        <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}

      {transactionHash && (
        <Box marginTop="3">
          <Text variant="normal" color="text100" fontWeight="bold">
            Transaction Hash:
          </Text>
          <a href={`${blockExplorerURL}tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </Box>
      )}
    </Box>
  )
}
