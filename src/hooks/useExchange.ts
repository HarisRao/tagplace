import { defaultAbiCoder } from '@ethersproject/abi'
import { MintData, MintMultipleData } from 'config/types/MintData'
import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import CryptoJS from 'crypto-js'
import { toastSuccess } from 'state/actions'
import { useLoggedInUser } from 'state/hooks'
import { Order, Token } from 'state/types'
import { getNaaSAddress } from 'utils/addressHelpers'
import { getOrderNonce, getOrderSignature } from 'utils/apiHelper'
import {
  AssetData,
  getERC1155MintAssetData,
  getETHAssetData,
  getERC20AssetData,
  getERC1155AssetData,
  getERC1155MintMultipleAssetData,
  getERC1155MintNFTsAssetData,
  ERC1155_LAZY_NFTS_ASSET_CLASS,
} from 'utils/naasHelpers'
import { atomicMatch, AtomicOrder, cancelOrder } from 'utils/atomicMatch'
import { handleTransactionCall } from 'utils/callHelpers'
import { NULL_SIG, signOrder, ZERO_BYTES32 } from 'utils/signatures'
import { useExchangeContract, useNaaSStaticContract, useProxyRegistryContract } from './useContract'
import { useActiveWeb3React } from './web3'

export const useTakeOrder = () => {
  const dispatch = useDispatch()
  const { accessToken, account } = useLoggedInUser()
  const exchange = useExchangeContract()
  const naasStatic = useNaaSStaticContract()
  const registry = useProxyRegistryContract()
  const [isTransacting, setTransacting] = useState(false)

  const takeOrder = useCallback(
    async (sellOrder: Order, assetToken: Token, price: BigNumberish, amount?: number) => {
      setTransacting(true)

      try {
        let assetData: AssetData
        const isNative = assetToken.address?.toLowerCase() === '0x'
        if (isNative) assetData = getETHAssetData(price)
        assetData = getERC20AssetData(assetToken.address, price)

        const transferWithFeesExactFrag = naasStatic.interface.getFunction('transferWithFeesExact')
        const transferWithFeesExact = naasStatic.interface.getSighash(transferWithFeesExactFrag)
        const assetTypes = 'tuple(bytes4 assetClass,bytes data,uint256 value)'
        const asset = defaultAbiCoder.encode(
          ['address', assetTypes, assetTypes],
          [exchange.address, assetData, sellOrder.assetDataObject],
        )

        const signature = await getOrderSignature(accessToken, sellOrder.id)
        const nonce = await getOrderNonce(accessToken)

        const buyOrder: AtomicOrder = {
          registry: registry.address,
          maker: account,
          staticTarget: naasStatic.address,
          staticSelector: transferWithFeesExact,
          staticExtradata: asset,
          maximumFill: '1',
          listingTime: '0',
          expirationTime: '10000000000',
          salt: nonce,
        }

        let finalPrice = BigNumber.from(price.toString())
        let extraAssetSellData = '0x'
        if (sellOrder.assetDataObject.assetClass === ERC1155_LAZY_NFTS_ASSET_CLASS) {
          finalPrice = finalPrice.mul(amount)
          extraAssetSellData = defaultAbiCoder.encode(['uint256'], [amount])
        }

        const payingAssetData = { ...assetData, value: finalPrice }
        const buyTransfer = exchange.interface.encodeFunctionData('transferWithFees', [
          registry.address,
          buyOrder.maker,
          sellOrder.dataObject.maker,
          payingAssetData,
          sellOrder.assetDataObject,
          '0x',
          extraAssetSellData,
        ])
        const sellTransfer = exchange.interface.encodeFunctionData('transferWithFees', [
          registry.address,
          sellOrder.dataObject.maker,
          buyOrder.maker,
          sellOrder.assetDataObject,
          payingAssetData,
          extraAssetSellData,
          '0x',
        ])
        const buyCall = { target: exchange.address, howToCall: 0, data: buyTransfer }
        const sellCall = { target: exchange.address, howToCall: 0, data: sellTransfer }

        const sn = CryptoJS.AES.decrypt(signature, account?.toLowerCase())
        const result = await handleTransactionCall(
          () =>
            atomicMatch(
              exchange,
              buyOrder,
              NULL_SIG,
              buyCall,
              sellOrder.dataObject,
              sn.toString(CryptoJS.enc.Utf8),
              sellCall,
              ZERO_BYTES32,
              isNative ? finalPrice : undefined,
            ),
          dispatch,
        )
        if (result) dispatch(toastSuccess('Transaction succeeded', 'Congratulations on your purchase'))
        return result
      } finally {
        setTransacting(false)
      }
    },
    [dispatch, accessToken, account, exchange, naasStatic, registry],
  )

  return { takeOrder, isTransacting }
}

export const useCreateOrder = () => {
  const { library, account } = useActiveWeb3React()
  const signer = library?.getSigner(account)
  const { accessToken } = useLoggedInUser()

  const exchange = useExchangeContract()
  const naasStatic = useNaaSStaticContract()
  const registry = useProxyRegistryContract()
  const [creatingOrder, setCreating] = useState(false)

  const signNewOrder = useCallback(
    async (getAssetData: () => AssetData, counterToken: Token, price: BigNumberish, maximumFill = 1) => {
      setCreating(true)

      try {
        const assetData = getAssetData()

        let counterAssetData: AssetData
        if (counterToken.address?.toLowerCase() === '0x') counterAssetData = getETHAssetData(price)
        else counterAssetData = getERC20AssetData(counterToken.address, price)

        const transferWithFeesExactFrag = naasStatic.interface.getFunction('transferWithFeesExact')
        const transferWithFeesExact = naasStatic.interface.getSighash(transferWithFeesExactFrag)
        const assetTypes = 'tuple(bytes4 assetClass,bytes data,uint256 value)'
        const asset = defaultAbiCoder.encode(
          ['address', assetTypes, assetTypes],
          [exchange.address, assetData, counterAssetData],
        )

        const nonce = await getOrderNonce(accessToken)
        const atomicOrder: AtomicOrder = {
          registry: registry.address,
          maker: account,
          staticTarget: naasStatic.address,
          staticSelector: transferWithFeesExact,
          staticExtradata: asset,
          maximumFill,
          listingTime: '0',
          expirationTime: '10000000000',
          salt: nonce,
        }

        const signature = await signOrder(signer, exchange, atomicOrder)
        return { signature, atomicOrder, assetData }
      } finally {
        setCreating(false)
      }
    },
    [account, signer, accessToken, exchange, naasStatic, registry],
  )

  const createMintOrder = useCallback(
    async (mintData: MintData, counterToken: Token, price: BigNumberish, maximumFill = 1) => {
      return signNewOrder(() => getERC1155MintAssetData(getNaaSAddress(), mintData), counterToken, price, maximumFill)
    },
    [signNewOrder],
  )

  const createMintMultipleOrder = useCallback(
    async (mintData: MintMultipleData, counterToken: Token, price: BigNumberish, maximumFill = 1) => {
      return signNewOrder(
        () => getERC1155MintMultipleAssetData(getNaaSAddress(), mintData),
        counterToken,
        price,
        maximumFill,
      )
    },
    [signNewOrder],
  )

  const createMintNFTsOrder = useCallback(
    async (mintData: MintMultipleData, counterToken: Token, price: BigNumberish, maximumFill = 1) => {
      return signNewOrder(
        () => getERC1155MintNFTsAssetData(getNaaSAddress(), mintData),
        counterToken,
        price,
        maximumFill,
      )
    },
    [signNewOrder],
  )

  const createOrder = useCallback(
    async (tokenAddress: string, tokenId: BigNumberish, counterAsset: Token, price: BigNumberish, maximumFill = 1) => {
      return signNewOrder(() => getERC1155AssetData(tokenAddress, tokenId), counterAsset, price, maximumFill)
    },
    [signNewOrder],
  )

  return { createOrder, createMintOrder, createMintMultipleOrder, createMintNFTsOrder, creatingOrder }
}

export const useCancelExchangeOrder = () => {
  const dispatch = useDispatch()
  const exchange = useExchangeContract()
  const [cancelling, setCancelling] = useState(false)

  const handleCancelOrder = useCallback(
    async (order: AtomicOrder) => {
      setCancelling(true)
      try {
        const result = await handleTransactionCall(() => cancelOrder(exchange, order), dispatch)
        if (result) dispatch(toastSuccess('Transaction succeeded', 'Order cancelled'))
        return result
      } finally {
        setCancelling(false)
      }
    },
    [dispatch, exchange],
  )

  return { cancelling, cancelExchangeOrder: handleCancelOrder }
}
