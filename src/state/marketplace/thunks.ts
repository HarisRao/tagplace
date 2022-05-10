import { toastError } from 'state/toasts'
import { AppDispatch, RootState } from '../store'
import { ordersLoadStart, ordersLoadSucceeded, ordersLoadFailed } from '.'
import { getOrders, getOrder } from './getOrders'

// Thunks

export const getMarketplaceOrders =
  (chainId?: number, fromUserOnly?: boolean, collectionIds?: string[], tokenIds?: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      if (getState().marketplace.isLoading) return
      const finalChainId = chainId && chainId > 0 ? chainId : parseInt(process.env.REACT_APP_CHAIN_ID)
      const accessToken = getState().user?.accessToken
      dispatch(ordersLoadStart())
      const orders = await getOrders(finalChainId, accessToken, fromUserOnly, collectionIds, tokenIds)
      dispatch(ordersLoadSucceeded(orders))
    } catch (error: any) {
      dispatch(toastError('Error retrieving marketplace orders', error?.message))
      dispatch(ordersLoadFailed(error?.message))
    }
  }

export const getMarketplaceOrder =
  (chainId: number, orderId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      if (getState().marketplace.isLoading) return
      const finalChainId = chainId && chainId > 0 ? chainId : parseInt(process.env.REACT_APP_CHAIN_ID)
      const accessToken = getState().user?.accessToken
      dispatch(ordersLoadStart())
      const order = await getOrder(finalChainId, orderId, accessToken)
      dispatch(ordersLoadSucceeded([order]))
    } catch (error: any) {
      console.error('toast')
      dispatch(toastError('Error retrieving marketplace order', error?.message))
      dispatch(ordersLoadFailed(error?.message))
    }
  }
