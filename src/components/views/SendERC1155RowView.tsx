import { Box, Select, TextInput, Button } from '@0xsequence/design-system'
import { GetTokenBalancesReturn } from '@0xsequence/indexer'
import { safeEventStringSetter } from '../../utils/safeEventStringSetter'
import { SelectOption } from './SendERC1155View'
import { useState } from 'react'
import { useEffect } from 'react'

export function SendERC1155RowView(props: {
  index: number
  options: GetTokenBalancesReturn | undefined
  onChange: (index: number, tokenId: string, value: string) => void
  removeTokenEntry: (index: number) => void
}) {
  const { onChange, index, options, removeTokenEntry } = props

  const [selectedId, setSelectedId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    onChange(index, selectedId, amount)
  }, [selectedId, amount])

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  }

  const fieldStyle: React.CSSProperties = {
    flex: 1
  }

  return (
    <Box style={rowStyle}>
      <Box style={fieldStyle}>
        <Select
          name={`sendERC1155TokenId${index}`}
          value={selectedId}
          disabled={!options}
          onValueChange={(value: string) => {
            setSelectedId(value)
          }}
          options={
            (options?.balances.map(balance => ({
              label: `${balance.tokenMetadata?.name || 'Unknown'} - ${balance.balance}`,
              value: balance.tokenID
            })) || []) as SelectOption[]
          }
          placeholder="Select a token"
        />
      </Box>
      <Box style={fieldStyle}>
        <TextInput type="text" value={selectedId} onChange={safeEventStringSetter(setSelectedId)} placeholder="Token ID" />
      </Box>
      <Box style={fieldStyle}>
        <TextInput type="text" value={amount} onChange={safeEventStringSetter(setAmount)} placeholder="Amount" />
      </Box>
      <Box style={fieldStyle}>
        <Button label="Remove" onClick={() => removeTokenEntry(index)} />
      </Box>
    </Box>
  )
}
