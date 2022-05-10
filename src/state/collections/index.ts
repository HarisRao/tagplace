import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CollectionsState, Collection } from '../types'

const initialState: CollectionsState = {
  data: {},
  isLoading: false,
}

export const tokensSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    collectionsLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    collectionsLoadSucceeded: (state, action: PayloadAction<{ chainId: number; collections: Collection[] }>) => {
      if (!action.payload) return state
      let chainData = state.data[action.payload?.chainId] ?? {}
      chainData = action.payload?.collections?.reduce(
        (data, val) => ({ ...data, [`${val.contractAddress}-${val.subCollectionId}`?.toLowerCase()]: val }),
        chainData,
      )
      return {
        ...state,
        isLoading: false,
        data: { ...state.data, [action.payload?.chainId]: chainData },
      }
    },
    collectionsLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
  },
})

// Actions
export const { collectionsLoadStart, collectionsLoadSucceeded, collectionsLoadFailed } = tokensSlice.actions

export default tokensSlice.reducer
