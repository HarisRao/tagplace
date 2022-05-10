import { BigNumber, BigNumberish } from 'ethers'
import moment from 'moment'
import { AssetData } from 'utils/naasHelpers'
import { AtomicOrder } from 'utils/atomicMatch'
import { Toast } from '../components/Toast'

// Models

export interface User {
  id: string
  publicAddress: string
  username?: string
  mailAddress?: string
  avatar?: string
  kycKey?: string
  kyced?: boolean
  kycStatus?: 'created' | 'processing' | 'pending' | 'approved' | 'declined'
  lastRefreshed?: string
}

export enum TokenType {
  UNKOWN = 'UNKOWN',
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC777 = 'ERC777',
  ERC1155 = 'ERC1155',
}

export interface Token {
  address: string
  name: string
  symbol?: string // ERC1155 does not have a symbol in most cases
  decimals?: number
  totalSupply?: BigNumber
  type: TokenType
  accountBalance?: BigNumber
  approvals?: { [spender: string]: BigNumber }
  approvalForAll?: { [spender: string]: boolean }

  ownersNfts?: Record<string, string[]>
  nfts?: Record<string, NFT>
}

export interface NFT {
  tokenId: string
  owner: string
  amount?: BigNumberish
  uri?: string
  metadata?: Metadata
}

/* eslint-disable camelcase */
export interface IpfsMetadata {
  collectionId: string | number
  collectionMetadata: Metadata
  tokens:
    | {
        metadata: Metadata
        tokenIds: (string | number)[]
        prices?: string[]
      }
    | {
        metadata: Metadata
        tokenId: string | number
        price?: string
      }[]
    | {
        metadata: Metadata
        tokenIds: (string | number)[]
        prices?: string[]
      }[]
  externalBaseUrl?: string
}
export interface Metadata {
  name: string
  description?: string
  image?: string
  image_data?: string // Raw SVG image data
  external_url?: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  attributes?: MetadataAttribute[]
  properties?: Record<string, MetadataProperty | string | number | string[] | number[]>
}
export interface MetadataAttribute {
  display_type?: string
  trait_type?: string
  value: string | number | string[] | number[]
}
export interface MetadataProperty {
  name: string
  value: string | number | string[] | number[]
  display_value?: string | number | string[] | number[]
  class?: string
  css?: any
  [key: string]: any
}
export interface Stake {
  owner: string
  balances: BigNumber
  end_staking: BigNumber
  duration: BigNumber
  changeClaimed: boolean
  check_claim: BigNumber
}
/* eslint-enable camelcase */

export interface PropertyUser {
  address?: string
  value?: number
}

export interface PropertyInformation {
  image: string
  bannerImages: string[]
  name: string

  propertyType: string
  location: string
  area: string
  bedrooms: number
  bathrooms: number
  garages?: number
  size: string
  description: string

  financialInformation?: FinancialInformation

  metadataUri?: string
  metadataCollectionUri?: string

  creators?: PropertyUser[]
  royalties?: PropertyUser[]
}

export interface FinancialInformation {
  annualInterest: number
  annualInterestIncludingFlip: number
  annualRent: number
  annualNetProfit: number
  montlyCosts: number
  monthlyRentPeakSeason: number
  monthlyRentLowSeaon: number
  revaluationProperyPrice: number
}

export interface PropertyCreationInformation extends PropertyInformation {
  id: number

  uploadImage: File
  uploadBannerImages: File[]

  prices: PropertyPrice[]
  amountToMint: number
  totalPrice: BigNumber
}
export interface PropertyPrice {
  value: BigNumber
  amount: number
}

export interface PropertyCollection extends PropertyInformation {
  id: number
  totalPrice?: BigNumberish
  properties?: { [key: number]: Property }
}

export interface Property extends PropertyInformation {
  id: number
  price?: BigNumberish
  collectionId: number
}

export interface Order {
  id: number
  chainId: number
  contractAddress: string
  subCollectionId: string
  tokenId?: string
  amount?: number
  user: string
  isBid?: boolean
  isAuction?: boolean
  isLazyMint?: boolean
  price: string
  fills: number
  counterAssets: string
  data: string
  signature?: string
  assetData?: string
  mintData?: string
  createdAt?: string
  updatedAt?: string
  createdAtDate?: moment.Moment
  updatedAtDate?: moment.Moment

  counterAssetsObject: Token[]
  dataObject?: AtomicOrder
  assetDataObject?: AssetData
  mintDataObject?: PropertyCreationInformation
}

export interface Collection {
  chainId: number
  contractAddress: string
  subCollectionId: string
  owner?: string
  description?: string
  currentId?: number
  tokenIds: string[]
  metadataUri: string
  metadata?: Metadata
}

// Slices states

export interface ChainIdData<T, K extends string | number | symbol = string> {
  [chainId: number]: Record<K, T>
}

export interface ToastsState {
  data: Toast[]
}

export interface UserState {
  isLoggedIn: boolean
  data: User
  accessToken: string
  isLoading: boolean
}

export interface CollectionsState {
  data: ChainIdData<Collection>
  isLoading: boolean
  loadingError?: string
}

export interface TokensState {
  data: ChainIdData<Token>
  isLoading: boolean
  loadingError?: string
}

export interface MarketplaceState {
  data: { [key: string]: Order }
  collectionData: { [key: string]: { [key: string]: Order } }
  isLoading: boolean
  loadingError?: string
}

export interface PropertiesState {
  data: { [key: number]: Property }
  collections: { [key: number]: PropertyCollection }
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}
