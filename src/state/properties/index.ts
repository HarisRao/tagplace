import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty, isUndefined, merge } from 'lodash'
import { tokenIdValues } from 'utils/naasHelpers'
import { PropertyCollection, PropertiesState, Order, Token, Collection } from '../types'
import { convertMetadata, convertOrder } from './convertMetadata'

const initialState: PropertiesState = {
  data: {},
  collections: {},
}

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    propertiesForCollections: (state, action: PayloadAction<Collection[]>) => {
      const properties: { [key: string]: PropertyCollection } = {}
      action?.payload?.forEach(async (collection) => {
        if (collection.metadata) {
          const collectionId = parseInt(collection.subCollectionId)
          properties[collectionId] = convertMetadata(collection.metadata, collectionId)
        }
      })
      setCollectionToCurrentState(state, properties)
    },
    propertiesForTokens: (state, action: PayloadAction<Token[]>) => {
      const properties: { [key: string]: PropertyCollection } = {}
      action?.payload?.forEach(async (token) => {
        Object.values(token?.nfts ?? {}).forEach((nft) => {
          if (nft.metadata) {
            const tokenIdData = tokenIdValues(nft.tokenId)
            const tokenIdNumber = parseInt(nft.tokenId)
            if (isUndefined(state.data[tokenIdNumber])) {
              properties[tokenIdData.collectionId] = convertMetadata(
                nft.metadata,
                tokenIdData.collectionId,
                tokenIdNumber,
              )
            }
          }
        })
      })
      setCollectionToCurrentState(state, properties)
    },
    propertiesForOrders: (state, action: PayloadAction<Order[]>) => {
      const properties: { [key: string]: PropertyCollection } = {}
      action?.payload?.forEach(async (order) => {
        if (!isEmpty(order.mintData)) {
          if (isUndefined(state.data[parseInt(order.subCollectionId)])) {
            properties[parseInt(order.subCollectionId)] = convertOrder(order)
          }
        } else {
          // todo, create based on metadata?
        }
      })
      setCollectionToCurrentState(state, properties)
    },
  },
})

const setCollectionToCurrentState = (state: PropertiesState, orderInfo: { [key: string]: PropertyCollection }) => {
  if (!orderInfo || isEmpty(orderInfo)) return
  // eslint-disable-next-line no-param-reassign
  state.data = Object.values(orderInfo).reduce((props, value) => ({ ...props, ...value.properties }), state.data)
  // eslint-disable-next-line no-param-reassign
  state.collections = merge(state.collections, orderInfo)
}

// Actions
export const { propertiesForCollections, propertiesForTokens, propertiesForOrders } = propertiesSlice.actions

export default propertiesSlice.reducer
