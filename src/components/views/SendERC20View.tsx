import { useEffect, useState } from 'react'
import { Box, Text, Button, TextInput, Spinner, Select } from "@0xsequence/design-system"
import { ethers } from "ethers"
import { node, sequence } from '../../main'
import { isSentTransactionResponse, Network } from '@0xsequence/waas'

interface TokenOption {
  label: string
  value: string
}

const tokenOptions: TokenOption[] = [
  { label: 'Custom Token', value: '' },
  { label: 'USDC Old', value: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' },
  { label: 'USDC New', value: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' },
  { label: 'DAI', value: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' },
]

export function SendERC20View(props: {network?: Network}) {
  const [selectedToken, setSelectedToken] = useState<string>(tokenOptions[0].value)
  const [customTokenAddress, setCustomTokenAddress] = useState<string>('')
  const [enabledCustomToken, setEnabledCustomToken] = useState<boolean>(true)
  const [tokenBalance, setTokenBalance] = useState<string>('---')
  const [destinationAddress, setDestinationAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [transactionHash, setTransactionHash] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [decimals, setDecimals] = useState<number>(0)

  useEffect(() => {
    fetchTokenBalance(customTokenAddress)
  }, [customTokenAddress])

  const fetchTokenBalance = async (tokenAddress: string) => {
    if (!ethers.utils.isAddress(tokenAddress)) {
      setTokenBalance('---')
      return
    }

    setTokenBalance('...')

    const contract = new ethers.Contract(tokenAddress, [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)'
    ], node)

    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(sequence.getAddress()),
      contract.decimals(),
      contract.symbol()
    ])

    setDecimals(decimals)
    setTokenBalance(`${ethers.utils.formatUnits(balance, decimals)} ${symbol}`)
  }

  const sendToken = async () => {
    try {
      setError('')
      setIsLoading(true)

      const tx = await sequence.sendERC20({
        token: customTokenAddress,
        to: destinationAddress,
        value: ethers.utils.parseUnits(amount, decimals),
        network: props.network?.id
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

  const selectToken = (tokenAddress: string) => {
    setSelectedToken(tokenAddress)
    if (tokenAddress === '') {
      setCustomTokenAddress('')
      setEnabledCustomToken(true)
    } else {
      setCustomTokenAddress(tokenAddress)
      setEnabledCustomToken(false)
    }
  }

  return (
    <Box>
      <Box marginTop="5">
        <Select
          name="token"
          options={tokenOptions}
          value={selectedToken ?? ''}
          onValueChange={(value) => selectToken(value)}
        />
        <Box marginTop="5">
          <TextInput
            type="text"
            value={customTokenAddress}
            disabled={!enabledCustomToken}
            onChange={(e: any) => setCustomTokenAddress(e.target.value)}
            placeholder="Custom ERC20 Contract Address"
          />
        </Box>
      </Box>

      <Box marginTop="3">
        <Text variant="normal">Token Balance: {tokenBalance}</Text>
        <Button marginLeft="2" size="xs" label="Fetch" onClick={() => fetchTokenBalance(customTokenAddress)} />
      </Box>

      <Box marginTop="5">
        <TextInput
          type="text"
          value={destinationAddress}
          onChange={(e: any) => setDestinationAddress(e.target.value)}
          placeholder="Destination Address"
        />
      </Box>

      <Box marginTop="5">
        <TextInput
          type="text"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </Box>

      {error && (
        <Box marginTop="3">
          <Text color="error">Error: {error}</Text>
        </Box>
      )}

      {!isLoading ? (
        <Button
          marginTop="5"
          label="Send Token"
          onClick={sendToken}
        />
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
          <a href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </Box>
      )}
    </Box>
  )
}
