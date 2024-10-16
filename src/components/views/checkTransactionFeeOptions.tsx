import { Transaction, Network, FeeOption } from '@0xsequence/waas'
import { sequence } from '../../main'

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
