import { useCallback, useEffect, useMemo, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { createSelector, createStructuredSelector } from 'reselect'
import { createCachedSelector } from 're-reselect'
import { isEmpty, isObject, isUndefined, uniq } from 'lodash'
import Web3 from 'web3'
import { BigNumberish, Contract } from 'ethers'
import { useActiveWeb3React } from 'hooks/web3'
import { useCancelExchangeOrder, useCreateOrder, useTakeOrder } from 'hooks/useExchange'
import { addFiles, addOrders, deleteOrder, fulFillOrder, incrementId } from 'utils/apiHelper'
import { getNaaSAddress, getTokenAddress } from 'utils/addressHelpers'
import { tokenId } from 'utils/naasHelpers'
import { getIPFSMetadata } from 'utils/ipfs'
import configTokens, { TokenConfig } from 'config/constants/tokens'
import { MintMultipleData } from 'config/types/MintData'
import { AppDispatch, RootState } from './store'
import { Toast } from '../components/Toast'
import {
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  propertiesForCollections,
  propertiesForTokens,
  propertiesForOrders,
  getCollection,
} from './actions'
import { loadLoggedInUser, loginWallet, updateUser } from './user/thunks'
import { Collection, IpfsMetadata, Order, Property, PropertyCreationInformation, Token, TokenType, User } from './types'
import { toastError, toastInfo, toastSuccess, toastWarning } from './toasts'
import { getNFTs, getToken, getTokens } from './tokens/thunks'
import { getMarketplaceOrder, getMarketplaceOrders } from './marketplace/thunks'
import { ordersLoadSucceeded, removeOrder } from './marketplace'
import { userUnload } from './user'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Toasts

export const useToast = () => {
  const dispatch = useAppDispatch()
  const helpers = useMemo(() => {
    return {
      toastError,
      toastInfo,
      toastSuccess,
      toastWarning,
      push: (toast: Toast) => dispatch(pushToast(toast)),
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// User

export const useCheckLoginLogout = () => {
  const { account, library, active } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { data, isLoggedIn } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (account && data?.publicAddress && account.toLowerCase() !== data.publicAddress.toLowerCase()) {
      dispatch(userUnload())
    }

    if (!isLoggedIn && active && account && library) {
      dispatch(loginWallet(library, account, true))
    }
  }, [account, data, isLoggedIn, active, library, dispatch])
}

export const useLogin = () => {
  const { account, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const login = useCallback(() => {
    if (account && library) {
      dispatch(loginWallet(library, account))
    }
  }, [account, library, dispatch])

  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account, login }
}

export const useLoggedInUser = () => {
  const { account } = useActiveWeb3React()
  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account }
}

export const useUpdateUser = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const handleUpdateUser = useCallback(
    (user: Partial<User>) => {
      if (account) dispatch(updateUser(user))
    },
    [dispatch, account],
  )
  return handleUpdateUser
}

export const useUserKYC = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const { isLoggedIn, data } = useAppSelector((state) => state.user)

  const [triggered, setTriggered] = useState(false)
  useEffect(() => {
    if (!triggered && data && (!data.lastRefreshed || moment(data.lastRefreshed) < moment().subtract('1 hours'))) {
      setTriggered(true)
      dispatch(loadLoggedInUser())
    }
  }, [dispatch, data, triggered])

  const onStart = useCallback(() => {
    if (!account) dispatch(toastError('Verification error', 'Your wallet is not connected'))
    if (!isLoggedIn) dispatch(toastError('Verification error', 'You are not logged in'))
    return account && isLoggedIn
  }, [dispatch, account, isLoggedIn])

  const onSubmit = useCallback(
    (kycKey: string) => {
      if (account) dispatch(updateUser({ kycKey }))
    },
    [dispatch, account],
  )

  const onError = useCallback(
    (errorCode) => {
      dispatch(toastError('Verification error', errorCode))
    },
    [dispatch],
  )

  return { onStart, onSubmit, onError, account, kyced: data?.kyced, kycStatus: data?.kycStatus }
}

// Collections

const collectionSelector = createCachedSelector(
  (state: RootState) => state.collections.data,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, address: string) => address,
  (_: RootState, __: number, ___: string, collectionId: string) => collectionId,
  (data, chainId, address, collectionId) => (data[chainId] ?? {})[`${address}-${collectionId}`?.toLowerCase()],
)((_: RootState, chainId: number, address: string, collectionId: string) => `${chainId}_${address}_${collectionId}`)
const collectionStructuredSelector = createStructuredSelector({
  collection: collectionSelector,
  isLoadingCollection: (state: RootState) => state.collections.isLoading,
})

export const useCollection = (address: string, collectionId: string) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { collection, isLoadingCollection } = useAppSelector((state) =>
    collectionStructuredSelector(state, chainId, address, collectionId),
  )

  useEffect(() => {
    if (address && Web3.utils.isAddress(address)) {
      dispatch(getCollection(chainId, address, collectionId))
    }
  }, [dispatch, chainId, address, collectionId])
  return { collection, isLoadingCollection }
}

// Tokens

const tokenSelector = createCachedSelector(
  (state: RootState) => state.tokens.data,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, address: string) => address,
  (data, chainId, address) => (data[chainId] ?? {})[address?.toLowerCase()],
)((_: RootState, chainId: number, address: string) => `${chainId}_${address}`)
const tokenStructuredSelector = createStructuredSelector({
  token: tokenSelector,
  isLoadingToken: (state: RootState) => state.tokens.isLoading,
})

export const useToken = (
  addressOrConfig: string | TokenConfig,
  spender?: string | Contract,
  type = TokenType.ERC20,
) => {
  const address = isObject(addressOrConfig) ? getTokenAddress(addressOrConfig) : addressOrConfig
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useAppSelector((state) => tokenStructuredSelector(state, chainId, address))

  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender

  useEffect(() => {
    if (
      account &&
      address &&
      Web3.utils.isAddress(address) &&
      (!spenderAddress || Web3.utils.isAddress(spenderAddress))
    ) {
      dispatch(getToken(chainId, address, account, spenderAddress, type))
    }
  }, [dispatch, address, type, account, chainId, spenderAddress])
  return { token, isLoadingToken }
}

const tokensSelector = createCachedSelector(
  (state: RootState) => state.tokens.data,
  (_: RootState, chainId: number) => chainId,
  (data, chainId) => data[chainId],
)((_: RootState, chainId: number) => chainId)
const tokensStructuredSelector = createStructuredSelector({
  tokens: tokensSelector,
  isLoadingTokens: (state: RootState) => state.tokens.isLoading,
})

export const useTokens = (addresses: string[], type = TokenType.ERC20) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { tokens, isLoadingTokens } = useAppSelector((state) => tokensStructuredSelector(state, chainId))

  useEffect(() => {
    if (addresses) {
      dispatch(getTokens(chainId, addresses, account, null, type))
    }
  }, [dispatch, addresses, type, account, chainId])

  return { tokens, isLoadingTokens }
}

export const useUserPropertyTokens = (tokenIds?: string[]) => {
  return useUserNFTs(getNaaSAddress(), tokenIds)
}

export const useUserNFTs = (tokenAddress?: string, tokenIds?: string[]) => {
  const { account } = useActiveWeb3React()
  return useNFTs(tokenAddress, account, tokenIds)
}

export const usePropertyTokens = (userAddress?: string, tokenIds?: string[]) => {
  return useNFTs(getNaaSAddress(), userAddress, tokenIds)
}

const nftSelector = createCachedSelector(
  (state: RootState) => state.tokens.data,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, tokenAddress: string) => tokenAddress,
  (_: RootState, __: number, ___: string, userAddress: string) => userAddress,
  (_: RootState, __: number, ___: string, ____: string, tokenIds: string[]) => tokenIds,
  (data, chainId, tokenAddress, userAddress, tokenIds) => {
    const chainTokens = chainId ? data[chainId] ?? {} : {}
    let tokens = tokenAddress ? [chainTokens[tokenAddress.toLowerCase()]] : Object.values(chainTokens)
    if (userAddress) {
      tokens = tokens
        .map((token) => {
          const nftIds = token?.ownersNfts ? token?.ownersNfts[userAddress.toLowerCase()] : undefined
          const nfts = Object.fromEntries(
            Object.entries(token?.nfts ?? {}).filter((o) =>
              nftIds.some((id) => id?.toLowerCase() === o[0].toLowerCase()),
            ),
          )
          return { ...token, ownersNfts: nftIds ? { [userAddress.toLowerCase()]: nftIds } : undefined, nfts }
        })
        .filter((token) => !isEmpty(token?.nfts))
    }
    if (!isUndefined(tokenIds)) {
      tokens = tokens
        .map((token) => ({
          ...token,
          nfts: Object.fromEntries(
            Object.entries(token?.nfts ?? {}).filter((o) =>
              tokenIds.some((id) => id?.toLowerCase() === o[0].toLowerCase()),
            ),
          ),
        }))
        .filter((token) => !isEmpty(token?.nfts))
    }
    return tokens
  },
)(
  (_: RootState, chainId: number, tokenAddress: string, userAddress: string, tokenIds: string[]) =>
    `${chainId}_${tokenAddress}_${userAddress}_${tokenIds?.join('|')}`,
)
const nftStructuredSelector = createStructuredSelector({
  tokens: nftSelector,
  isLoadingTokens: (state: RootState) => state.tokens.isLoading,
})

export const useNFTs = (tokenAddress?: string, userAddress?: string, tokenIds?: string[]) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { tokens, isLoadingTokens } = useAppSelector((state) =>
    nftStructuredSelector(state, chainId, tokenAddress, userAddress, tokenIds),
  )

  useEffect(() => {
    if (chainId && (isUndefined(tokenIds) || tokenIds.length > 0)) {
      dispatch(getNFTs(chainId, tokenAddress, userAddress, tokenIds))
    }
  }, [dispatch, chainId, tokenAddress, userAddress, tokenIds])

  return { tokens, isLoadingTokens }
}

// Token configs

export const useTokenConfigs = (tokens: Token[]) => {
  return useMemo(() => {
    if (!tokens) return {}
    const values: { [symbol: string]: TokenConfig } = {}
    return Object.values(configTokens).reduce((val, configToken) => {
      const addresses = Object.values(configToken.address)
      const token = tokens.find((ca) => addresses.some((a) => ca.address.toLowerCase() === a.toLowerCase()))
      return token ? { ...val, [token.symbol]: configToken } : val
    }, values)
  }, [tokens])
}

export const useOrdersTokenConfigs = (orders: Order[]) => {
  const tokens = useMemo(
    () =>
      Object.values(
        orders.reduce((tokenObj, order) => {
          if (!order.counterAssetsObject) return tokenObj
          return {
            ...tokenObj,
            ...Object.fromEntries(order.counterAssetsObject.map((t) => [t?.address?.toLowerCase(), t])),
          }
        }, {} as { [key: string]: Token }),
      ),
    [orders],
  )
  return useTokenConfigs(tokens)
}

// Marketplace

const marketplaceOrderSelector = createCachedSelector(
  (state: RootState) => state.marketplace.data,
  (_: RootState, orderId: string) => orderId,
  (data, orderId) => data[orderId],
)((_: RootState, orderId: string) => orderId)
const marketplaceOrderStructuredSelector = createStructuredSelector({
  order: marketplaceOrderSelector,
  isLoadingOrder: (state: RootState) => state.marketplace.isLoading,
})

export const useMarketplaceOrder = (orderId: string) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { order, isLoadingOrder } = useAppSelector((state) => marketplaceOrderStructuredSelector(state, orderId))

  useEffect(() => {
    if (orderId) {
      dispatch(getMarketplaceOrder(chainId, parseInt(orderId)))
    }
  }, [dispatch, chainId, orderId])

  return { order, isLoadingOrder }
}

const marketplaceOrdersSelector = createCachedSelector(
  (state: RootState) => state.marketplace.data,
  (_: RootState, user: string) => user,
  (_: RootState, __: string, collectionIds: string[]) => collectionIds,
  (data, user, collectionIds) => {
    let orders = !user
      ? data
      : Object.fromEntries(Object.entries(data ?? {}).filter((o) => user.toLowerCase() === o[1].user?.toLowerCase()))
    if (collectionIds)
      orders = Object.fromEntries(
        Object.entries(orders).filter((o) =>
          collectionIds?.some((id) => id?.toLowerCase() === o[1].subCollectionId?.toLowerCase()),
        ),
      )
    return orders
  },
)((_: RootState, user: string, collectionIds: string[]) => `${user}_${collectionIds?.join('|')}`)
const marketplaceOrdersStructuredSelector = createStructuredSelector({
  orders: marketplaceOrdersSelector,
  isLoadingOrders: (state: RootState) => state.marketplace.isLoading,
})

export const useMarketplaceOrders = (fromUserOnly?: boolean, collectionIds?: string[]) => {
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const { orders, isLoadingOrders } = useAppSelector((state) =>
    marketplaceOrdersStructuredSelector(state, fromUserOnly ? account ?? 'usermandatory' : null, collectionIds),
  )

  useEffect(() => {
    if (dispatch) {
      dispatch(getMarketplaceOrders(chainId, fromUserOnly, collectionIds))
    }
  }, [dispatch, chainId, fromUserOnly, collectionIds])

  return { orders, isLoadingOrders }
}

const ordersTokenSelector = createCachedSelector(
  (state: RootState) => state.marketplace.data,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, tokenIds: string[]) => tokenIds,
  (data, chainId, tokenIds) =>
    Object.values(data ?? {}).filter(
      (o) => o.chainId === chainId && tokenIds?.some((id) => id?.toLowerCase() === o.tokenId.toLowerCase()),
    ),
)((_: RootState, chainId: number, tokenIds: string[]) => `${chainId}_${tokenIds?.join('|')}`)
const ordersTokenStructuredSelector = createStructuredSelector({
  orders: ordersTokenSelector,
  isLoadingOrders: (state: RootState) => state.marketplace.isLoading,
})

export const useMarketplaceOrdersForUserTokens = (tokens: Token[]) => {
  const { account } = useActiveWeb3React()
  const tokenIds = useMemo(() => tokens?.map((t) => t.ownersNfts[account?.toLowerCase()]).flat(), [tokens, account])
  return useMarketplaceOrdersForTokenIds(tokenIds)
}
export const useMarketplaceOrdersForTokens = (tokens: Token[]) => {
  const tokenIds = useMemo(() => tokens?.map((t) => Object.keys(t.nfts ?? {})).flat(), [tokens])
  return useMarketplaceOrdersForTokenIds(tokenIds)
}
export const useMarketplaceOrdersForTokenIds = (tokenIds: string[]) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { orders, isLoadingOrders } = useAppSelector((state) => ordersTokenStructuredSelector(state, chainId, tokenIds))

  useEffect(() => {
    if (dispatch && chainId && !isEmpty(tokenIds)) {
      dispatch(getMarketplaceOrders(chainId, false, undefined, tokenIds))
    }
  }, [dispatch, chainId, tokenIds])

  return { orders, isLoadingOrders }
}

export const useListNewProperty = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { chainId } = useActiveWeb3React()
  const { account, accessToken } = useLoggedInUser()
  const { createMintNFTsOrder } = useCreateOrder()

  const [listing, setListing] = useState(false)
  const listProperty = useCallback(
    async (property: Partial<PropertyCreationInformation>, counterAsset: Token, maximumFill?: any) => {
      if (dispatch && chainId && account && accessToken && createMintNFTsOrder) {
        setListing(true)
        try {
          const tokenAddress = getNaaSAddress()
          // each property is a new collection
          const collectionId = await incrementId(accessToken, chainId, tokenAddress)
          const lastTokenId = await incrementId(accessToken, chainId, tokenAddress, collectionId, property.amountToMint)

          const tokenIds: string[] = []
          for (let id = lastTokenId - property.amountToMint; id <= lastTokenId; id++) {
            tokenIds.push(tokenId(account, collectionId, id))
          }

          const prices: string[] = []
          // eslint-disable-next-line no-restricted-syntax
          for (const price of property.prices) {
            for (let idx = 0; idx < price.amount; idx++) prices.push(price.value.toString())
          }

          const metadata = getIPFSMetadata(property)
          const ipfsSettings: IpfsMetadata = {
            collectionId,
            collectionMetadata: metadata,
            tokens: {
              metadata,
              tokenIds,
              prices,
            },
            externalBaseUrl: `${window.location.origin}/property`,
          }
          const blob = new Blob([JSON.stringify(ipfsSettings)], { type: 'application/json' })

          const fileData = await addFiles(accessToken, [blob, property.uploadImage, ...property.uploadBannerImages])
          const collectionURISplitted = fileData.entries[collectionId]?.split('/')
          if (!collectionURISplitted || collectionURISplitted.length < 2) {
            dispatch(toastError('IPFS upload failed', 'Please contact us'))
            return
          }
          const ipfsFolderUri = collectionURISplitted[collectionURISplitted.length - 2]

          let startId = lastTokenId - property.amountToMint
          const orders: Partial<Order>[] = []
          // eslint-disable-next-line no-restricted-syntax
          for (const price of property.prices) {
            const mintData: MintMultipleData = {
              minter: account,
              collectionId,
              tokenStartId: startId,
              tokenEndId: startId + property.amountToMint,
              tokenSupplies: [],
              collectionUri: fileData.entries[collectionId],
              baseUri: ipfsFolderUri,
              creators: property.creators.map((v) => ({ account, value: v.value })),
              royalties: [{ account, value: 500 }],
              signatures: [] as any[],
            }
            startId += property.amountToMint

            // eslint-disable-next-line no-await-in-loop
            const { signature, atomicOrder, assetData } = await createMintNFTsOrder(
              mintData,
              counterAsset,
              price.value,
              maximumFill,
            )

            orders.push({
              chainId,
              contractAddress: tokenAddress,
              subCollectionId: collectionId.toString(),
              amount: price.amount,
              user: account,
              isBid: false,
              isAuction: false,
              isLazyMint: true,
              price: price.value.toString(),
              counterAssets: getSimpleAssetsString([counterAsset]),
              data: JSON.stringify(atomicOrder),
              signature,
              assetData: JSON.stringify(assetData),
              mintData: JSON.stringify(fileData?.metadata?.collectionMetadata),
            })
          }

          const addedOrders = await addOrders(accessToken, orders)
          dispatch(ordersLoadSucceeded(addedOrders))

          navigate(`/property/${collectionId}`)
        } catch (err) {
          console.error(err)
          dispatch(toastError('Listing property failed', 'Check your console for more information'))
        } finally {
          setListing(false)
        }
      }
    },
    [dispatch, navigate, chainId, account, accessToken, createMintNFTsOrder],
  )

  return { listProperty, listing }
}

export const useListProperty = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { chainId } = useActiveWeb3React()
  const { account, accessToken } = useLoggedInUser()
  const { createOrder } = useCreateOrder()

  const [listing, setListing] = useState(false)
  const listProperty = useCallback(
    async (property: Property, counterAsset: Token, price: BigNumberish, maximumFill?: any) => {
      if (dispatch && chainId && account && accessToken && createOrder) {
        setListing(true)
        try {
          const tokenAddress = getNaaSAddress()

          const { signature, atomicOrder, assetData } = await createOrder(
            tokenAddress,
            property.id,
            counterAsset,
            price,
            maximumFill,
          )

          const order: Partial<Order> = {
            chainId,
            contractAddress: tokenAddress,
            subCollectionId: property.collectionId.toString(),
            tokenId: property.id.toString(),
            user: account,
            isBid: false,
            isAuction: false,
            isLazyMint: true,
            price: price.toString(),
            counterAssets: getSimpleAssetsString([counterAsset]),
            data: JSON.stringify(atomicOrder),
            signature,
            assetData: JSON.stringify(assetData),
          }

          const addedOrders = await addOrders(accessToken, [order])
          dispatch(ordersLoadSucceeded(addedOrders))

          navigate(`/property/${property.collectionId}`)
        } catch (err) {
          console.error(err)
          dispatch(toastError('Listing property failed', 'Check your console for more information'))
        } finally {
          setListing(false)
        }
      }
    },
    [dispatch, navigate, chainId, account, accessToken, createOrder],
  )

  return { listProperty, listing }
}

const getSimpleAssetsString = (assets: Token[]) => {
  return JSON.stringify(
    assets.map((asset) => ({
      address: asset.address,
      name: asset.name,
      symbol: asset.symbol,
      decimals: asset.decimals,
    })),
  )
}

export const useTakeProperty = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const { takeOrder } = useTakeOrder()

  const [buying, setBuying] = useState(false)
  const takeProperty = useCallback(
    async (order: Order, token: Token, price: BigNumberish, amount?: number) => {
      if (dispatch && accessToken && chainId && takeOrder) {
        setBuying(true)
        try {
          const success = await takeOrder(order, token, price, amount)
          if (success && order.amount <= 1) {
            await fulFillOrder(accessToken, chainId, order.id)
            dispatch(removeOrder(order.id))
          }
        } catch (err) {
          console.error(err)
          dispatch(toastError('Buying property failed', 'Check your console for more information'))
        } finally {
          setBuying(false)
        }
      }
    },
    [dispatch, accessToken, chainId, takeOrder],
  )

  return { takeProperty, buying }
}

export const useCancelOrder = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { chainId } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const { cancelExchangeOrder } = useCancelExchangeOrder()

  const [cancelling, setCancelling] = useState(false)
  const cancelOrder = useCallback(
    async (order: Order, returnPath?: string) => {
      if (dispatch && accessToken && chainId && cancelExchangeOrder) {
        setCancelling(true)
        try {
          const success = await cancelExchangeOrder(order?.dataObject)
          if (success) {
            await deleteOrder(accessToken, chainId, order.id)
            dispatch(removeOrder(order.id))
            if (returnPath && navigate) navigate(returnPath)
          }
        } catch (err) {
          console.error(err)
          dispatch(toastError('Cancelling order failed', 'Check your console for more information'))
        } finally {
          setCancelling(false)
        }
      }
    },
    [dispatch, accessToken, navigate, chainId, cancelExchangeOrder],
  )

  return { cancelling, cancelOrder }
}

// Properties

export const usePropertyCollection = (collectionId: string) => {
  const { collection, isLoadingCollection } = useCollection(getNaaSAddress(), collectionId)

  const collectionIds = useMemo(() => (collectionId ? [collectionId] : null), [collectionId])
  const { orders, isLoadingOrders } = useMarketplaceOrders(false, collectionIds)

  const orderArray = useMemo(() => (orders ? Object.values(orders) : undefined), [orders])
  const property = _usePropertiesForCollection(collection, orderArray)

  return { property, collection, orders, isLoading: isLoadingCollection || isLoadingOrders }
}

const propertiesCollectionSelector = createSelector(
  (state: RootState) => state.properties,
  (_: RootState, collection: Collection) => collection,
  (propertyState, collection) => propertyState.collections[parseInt(collection?.subCollectionId)],
)

const _usePropertiesForCollection = (collection: Collection, orders: Order[]) => {
  const dispatch = useAppDispatch()
  const property = useAppSelector((state) => propertiesCollectionSelector(state, collection))
  const properties = useAppSelector((state) => propertiesOrderSelector(state, orders))
  const finalProperty = property || (properties ?? [])[0]

  const [fetchedFromOrders, setFetchedFromOrders] = useState(false)
  useEffect(() => {
    if (dispatch && !property && collection) {
      dispatch(propertiesForCollections([collection]))
    }
    if (!fetchedFromOrders && dispatch && !property && isEmpty(properties) && !isEmpty(orders)) {
      setFetchedFromOrders(true)
      dispatch(propertiesForOrders(orders))
    }
  }, [dispatch, fetchedFromOrders, collection, orders, property, properties])

  return finalProperty
}

export const useUserProperties = () => {
  const { tokens, isLoadingTokens } = useUserPropertyTokens()
  const properties = _usePropertiesForTokens(tokens)
  return { tokens, properties, isLoading: isLoadingTokens }
}

const propertiesTokenSelector = createCachedSelector(
  (state: RootState) => state.properties.collections,
  (_: RootState, allTokenIds: number[]) => allTokenIds,
  (collections, allTokenIds) =>
    Object.values(collections ?? {}).filter((p) =>
      allTokenIds.some((id) => p.properties && !isUndefined(p.properties[id])),
    ),
)((_: RootState, allTokenIds: number[]) => `${allTokenIds?.join('|')}`)

const _usePropertiesForTokens = (tokens: Token[]) => {
  const dispatch = useAppDispatch()
  const allTokenIds = useMemo(
    () =>
      tokens.reduce(
        (tokenIds, token) => [...tokenIds, ...Object.keys(token?.nfts ?? {}).map((id) => parseInt(id))],
        [] as number[],
      ),
    [tokens],
  )

  const properties = useAppSelector((state) => propertiesTokenSelector(state, allTokenIds))

  useEffect(() => {
    if (dispatch && !isEmpty(tokens)) {
      dispatch(propertiesForTokens(tokens))
    }
  }, [dispatch, tokens])

  return properties
}

export const useMarketplaceProperty = (orderId: string) => {
  const { order, isLoadingOrder } = useMarketplaceOrder(orderId)
  const orderArray = useMemo(() => (order ? [order] : undefined), [order])
  const { properties, isLoadingProperties } = usePropertiesForOrders(orderArray)
  return { order, property: properties ? properties[0] : undefined, isLoading: isLoadingOrder || isLoadingProperties }
}

export const useMarketplaceProperties = () => {
  const { orders, isLoadingOrders } = useMarketplaceOrders()
  const orderArray = useMemo(() => {
    return Object.values(orders ?? {}).sort((a, b) => b.createdAtDate.unix() - a.createdAtDate.unix())
  }, [orders])
  const { properties, isLoadingProperties } = usePropertiesForOrders(orderArray)
  return { orders: orderArray, properties, isLoading: isLoadingOrders || isLoadingProperties }
}

const propertiesOrderSelector = createCachedSelector(
  (state: RootState) => state.properties.collections,
  (_: RootState, orders: Order[]) => orders,
  (collections, orders) =>
    uniq(orders?.map((o) => collections[parseInt(o.subCollectionId)]).filter((p) => !isUndefined(p))),
)((_: RootState, orders: Order[]) => `${orders?.map((o) => o.id).join('|')}`)

export const usePropertiesForOrders = (orders: Order[]) => {
  const dispatch = useAppDispatch()

  const tokenIds = useMemo(() => orders?.filter((o) => o.tokenId).map((o) => o.tokenId), [orders])
  const { tokens, isLoadingTokens } = useNFTs(getNaaSAddress(), undefined, tokenIds)

  const properties = useAppSelector((state) => propertiesOrderSelector(state, orders))

  useEffect(() => {
    if (dispatch && orders) {
      dispatch(propertiesForOrders(orders))
    }
    if (dispatch && tokens) {
      dispatch(propertiesForTokens(tokens))
    }
  }, [dispatch, orders, tokens])

  return { properties, isLoadingProperties: isLoadingTokens }
}
