import { Box, Button, ChevronRightIcon, Text } from '@0xsequence/design-system'

interface PaneProps {
  onCancel: () => void
  onConfirm: () => void
}

export const EmailConflictWarning = (props: PaneProps) => {
  const { onCancel, onConfirm } = props

  return (
    <Box style={{ maxWidth: '600px' }} flexDirection="column" paddingX="10" paddingY="4" alignItems="center" gap="4">
      <Box>
        <Text variant="large" color="text100" fontWeight="bold">
          Email already in use
        </Text>
      </Box>
      <Box height="full">
        <Text as="div" variant="normal" color="text50" textAlign="center">
          Another account with this email address already exists. You can cancel this or force create a new account.
        </Text>
      </Box>

      <Box flexDirection="row" gap="3" marginTop="6" marginBottom="2">
        <Button label="Cancel" onClick={onCancel} />
        <Button variant="primary" label="Create new account" onClick={onConfirm} />
      </Box>
    </Box>
  )
}
