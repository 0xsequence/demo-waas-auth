import { useEffect, useState } from 'react'

import { Box, Select, Text } from '@0xsequence/design-system'
import { ethers } from 'ethers'

import { FeeOption } from '@0xsequence/waas'

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
