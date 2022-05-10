import { BigNumberish } from '@ethersproject/bignumber'

export interface MintDataUser {
  account: string
  value: BigNumberish
}

export interface MintData {
  minter: string
  collectionId: BigNumberish
  tokenId: BigNumberish
  supply: BigNumberish
  collectionUri: string
  baseUri: string
  creators: MintDataUser[]
  royalties: MintDataUser[]
  signatures: string[]
}

export interface MintMultipleData {
  minter: string
  collectionId: BigNumberish
  tokenStartId: number
  tokenEndId: number
  tokenSupplies: BigNumberish[]
  collectionUri: string
  baseUri: string
  creators: MintDataUser[]
  royalties: MintDataUser[]
  signatures: string[]
}
