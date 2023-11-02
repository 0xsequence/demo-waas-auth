import { Box, Text } from '@0xsequence/design-system'

export const Logo = () => {
  return (
    <Box
      gap="2"
      flexDirection="column"
      borderStyle="solid"
      width="1/3"
      padding="4"
      borderWidth="thin"
      borderColor="borderNormal"
      borderRadius="sm"
    >
      <Text variant="xlarge" fontWeight="bold" color="gnosisLight">
        Demo App
      </Text>
      <Text variant="normal" marginLeft="auto" color="polygonLight">
        Showcasing WaaS
      </Text>
    </Box>
  )
}
