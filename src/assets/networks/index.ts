const networks = {
  AMOY: 80002,
  ARBITRUM: 42161,
  ARBITRUM_GOERLI: 421613,
  ARBITRUM_NOVA: 42170,
  ARBITRUM_SEPOLIA: 421614,
  AVALANCHE: 43114,
  AVALANCHE_TESTNET: 43113,
  BASE: 8453,
  BASE_GOERLI: 84531,
  BASE_SEPOLIA: 84532,
  B3_SEPOLIA: 1993,
  BLAST: 81457,
  BLAST_SEPOLIA: 168587773,
  BORNE_TESTNET: 94984,
  BSC: 56,
  BSC_TESTNET: 97,
  FANTOM: 250,
  FANTOM_TESTNET: 4002,
  GNOSIS: 100,
  GOERLI: 5,
  HOMEVERSE: 19011,
  HOMEVERSE_TESTNET: 40875,
  IMMUTABLE_ZKEVM: 13371,
  IMMUTABLE_ZKEVM_TESTNET: 13473,
  KOVAN: 42,
  MAINNET: 1,
  OPTIMISM: 10,
  OPTIMISM_SEPOLIA: 11155420,
  OPTIMISM_TESTNET: 69,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
  POLYGON_ZKEVM: 1101,
  RINKEBY: 4,
  ROPSTEN: 3,
  SEPOLIA: 11155111,
  ASTAR_ZKEVM: 3776,
  ASTAR_ZKYOTO: 6038361,
  XAI: 660279,
  XAI_SEPOLIA: 37714555429,
  XR_SEPOLIA: 2730
}

import mainnet from './1.png';
import optimism from './10.png';
import gnosis from './100.png';
import polygonZkevm from './1101.png';
import polygon from './137.png';
import fantom from './250.png';
import arbitrum from './42161.png';
import arbitrumNova from './42170.png';
import avalanche from './43114.png';
import apeChainTestnet from './33111.png';
import bsc from './56.png';
import base from './8453.png';
import baseSepolia from './84532.png';
import blast from './81457.png';
import blastSepolia from './168587773.png';
import sepolia from './11155111.png';
import optimismSepolia from './11155420.png';
import amoy from './80002.png';
import homeverse from './19011.png';
import homeverseTestnet from './40875.png';
import immutableZkevm from './13371.png';
import immutableZkevmTestnet from './13473.png';
import xai from './660279.png';
import xaiSepolia from './37714555429.png';
import arbitrumSepolia from './421614.png';
import astarZkevm from './3776.png';
import astarZkyoto from './6038361.png';
import b3Sepolia from './1993.png';
import xrSepolia from './2730.png';

export const networkImages = {
  [networks.MAINNET]: mainnet,
  [networks.ROPSTEN]: mainnet,
  [networks.GOERLI]: mainnet,
  [networks.KOVAN]: mainnet,
  [networks.OPTIMISM]: optimism,
  [networks.OPTIMISM_TESTNET]: optimism,
  [networks.OPTIMISM_SEPOLIA]: optimismSepolia,
  [networks.POLYGON]: polygon,
  [networks.POLYGON_MUMBAI]: polygon,
  [networks.POLYGON_ZKEVM]: polygonZkevm,
  [networks.ARBITRUM]: arbitrum,
  [networks.ARBITRUM_NOVA]: arbitrumNova,
  [networks.ARBITRUM_GOERLI]: arbitrum,
  [networks.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [networks.GNOSIS]: gnosis,
  [networks.BSC]: bsc,
  [networks.BSC_TESTNET]: bsc,
  [networks.FANTOM]: fantom,
  [networks.FANTOM_TESTNET]: fantom,
  [networks.AVALANCHE]: avalanche,
  [networks.AVALANCHE_TESTNET]: avalanche,
  [networks.BASE]: base,
  [networks.BASE_SEPOLIA]: baseSepolia,
  [networks.BLAST]: blast,
  [networks.BLAST_SEPOLIA]: blastSepolia,
  [networks.SEPOLIA]: sepolia,
  [networks.AMOY]: amoy,
  [networks.HOMEVERSE]: homeverse,
  [networks.HOMEVERSE_TESTNET]: homeverseTestnet,
  [networks.IMMUTABLE_ZKEVM]: immutableZkevm,
  [networks.IMMUTABLE_ZKEVM_TESTNET]: immutableZkevmTestnet,
  [networks.XAI]: xai,
  [networks.XAI_SEPOLIA]: xaiSepolia,
  [networks.ASTAR_ZKEVM]: astarZkevm,
  [networks.ASTAR_ZKYOTO]: astarZkyoto,
  [networks.B3_SEPOLIA]: b3Sepolia,
  [networks.XR_SEPOLIA]: xrSepolia
};

