const networks = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
  POLYGON_ZKEVM: 1101,
  BSC: 56,
  BSC_TESTNET: 97,
  OPTIMISM: 10,
  OPTIMISM_TESTNET: 69,
  ARBITRUM: 42161,
  ARBITRUM_GOERLI: 421613,
  ARBITRUM_NOVA: 42170,
  AVALANCHE: 43114,
  AVALANCHE_TESTNET: 43113,
  FANTOM: 250,
  FANTOM_TESTNET: 4002,
  GNOSIS: 100,
  AURORA: 1313161554,
  AURORA_TESTNET: 1313161556,
  BASE_GOERLI: 84531,
  HOMEVERSE_TESTNET: 40875
}

import mainnet from './1.png'
import optimism from './10.png'
import gnosis from './100.png'
import polygonZkevm from './1101.png'
import polygon from './137.png'
import fantom from './250.png'
import arbitrum from './42161.png'
import arbitrumNova from './42170.png'
import avalanche from './43114.png'
import bsc from './56.png'

export const networkImages = {
  [networks.MAINNET]: mainnet,
  [networks.ROPSTEN]: mainnet,
  [networks.GOERLI]: mainnet,
  [networks.KOVAN]: mainnet,
  [networks.OPTIMISM]: optimism,
  [networks.OPTIMISM_TESTNET]: optimism,
  [networks.POLYGON]: polygon,
  [networks.POLYGON_MUMBAI]: polygon,
  [networks.POLYGON_ZKEVM]: polygonZkevm,
  [networks.ARBITRUM]: arbitrum,
  [networks.ARBITRUM_NOVA]: arbitrumNova,
  [networks.ARBITRUM_GOERLI]: arbitrum,
  [networks.GNOSIS]: gnosis,
  [networks.BSC]: bsc,
  [networks.BSC_TESTNET]: bsc,
  [networks.FANTOM]: fantom,
  [networks.FANTOM_TESTNET]: fantom,
  [networks.AVALANCHE]: avalanche,
  [networks.AVALANCHE_TESTNET]: avalanche
}
