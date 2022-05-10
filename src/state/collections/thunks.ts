import { toastError } from 'state/toasts'
import { getCollectionsWithInfo } from 'utils/apiHelper'
import { AppDispatch, RootState } from '../store'
import { collectionsLoadStart, collectionsLoadSucceeded, collectionsLoadFailed } from '.'

// Thunks

// eslint-disable-next-line import/prefer-default-export
export const getCollection =
  (chainId: number, tokenAddress: string, collectionId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const collection = getState()?.tokens?.data[`${tokenAddress}-${collectionId}`?.toLowerCase()]
    if (collection) return

    try {
      dispatch(collectionsLoadStart())

      const collections = await getCollectionsWithInfo(chainId, tokenAddress, collectionId)

      dispatch(collectionsLoadSucceeded({ chainId, collections }))
    } catch (error: any) {
      dispatch(toastError('Error retrieving tokens data', error?.message))
      dispatch(collectionsLoadFailed(error?.message))
    }
  }
