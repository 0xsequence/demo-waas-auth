import { useEffect, useState } from 'react'

import { Box, Select, Text } from '@0xsequence/design-system'
import { ethers } from 'ethers'

import { FeeOption, Network, Transaction } from '@0xsequence/waas'
import { sequence } from '../../main.tsx'

export async function checkTransactionFeeOptions({
  transactions,
  network
}: {
  transactions: Transaction[]
  network?: Network
}): Promise<{ feeQuote: string | undefined; feeOptions: FeeOption[] | undefined; isSponsored: boolean }> {
  const resp = await sequence.feeOptions({
    transactions: transactions,
    network: network?.id
  })

  if (resp.data.feeQuote && resp.data.feeOptions) {
    return { feeQuote: resp.data.feeQuote, feeOptions: resp.data.feeOptions, isSponsored: false }
  }
  return { feeQuote: resp.data.feeQuote, feeOptions: resp.data.feeOptions, isSponsored: true }
}

export function TransactionFeeOptions(props: {
  feeOptions: FeeOption[] | undefined
  onSelected: (feeOption: FeeOption) => void
}) {
  const { feeOptions, onSelected } = props
  const [feeOption, setFeeOption] = useState<FeeOption>()

  useEffect(() => {
    if (feeOptions && feeOptions.length > 0) {
      setFeeOption(feeOptions[0])
      onSelected(feeOptions[0])
    }
  }, [feeOptions])

  useEffect(() => {
    if (feeOption) {
      onSelected(feeOption)
    }
  }, [feeOption])

  return feeOptions ? (
    <Box marginTop="5">
      <Text variant="normal" fontWeight="bold">
        Fee options:
      </Text>
      <Box marginTop="3"></Box>
      <Select
        name="chainId"
        labelLocation="top"
        onValueChange={tokenName => {
          const selected = feeOptions.find(option => option.token.name === tokenName)
          if (selected) {
            setFeeOption(selected)
          }
        }}
        value={feeOption?.token?.name}
        options={[
          ...feeOptions.map(option => ({
            label: (
              <Box alignItems="center" gap="2">
                <Text>
                  {option?.token?.name} {ethers.formatUnits(option?.value, option?.token?.decimals)}
                </Text>
              </Box>
            ),
            value: String(option?.token?.name)
          }))
        ]}
      />
    </Box>
  ) : (
    <Box></Box>
  )
}
