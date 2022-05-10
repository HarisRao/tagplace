import { PSI_API_NFT_URL } from 'config/constants/misc'
import { isEmpty } from 'lodash'
import { Collection, IpfsMetadata, Order } from 'state/types'

// Marketplace

/**
 * @param accessToken login accessToken
 * @param chainId current connected chain id
 * @param tokenAddress NFT token address
 * @param collectionId optional sub collection id, 0 is default for the whole collection
 * @param amount amount of id's to increment
 * @returns number of the new latest id
 */
export const incrementId = async (
  accessToken: string,
  chainId: number,
  tokenAddress: string,
  collectionId = 0,
  amount = 1,
): Promise<number> => {
  let apiUrl = `${PSI_API_NFT_URL}/collections/${chainId}/${tokenAddress}`
  if (collectionId > 0) apiUrl += `/${collectionId}`
  if (amount > 0) apiUrl += `?increment=${amount}`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error(await response.text())
  const collection: Collection = await response.json()
  return collection.currentId
}

/**
 * @param chainId current connected chain id
 * @param tokenAddress NFT token address
 * @param collectionId optional sub collection id, 0 is default for the whole collection
 * @returns number of the new latest id
 */
export const getCollectionsWithInfo = async (
  chainId: number,
  tokenAddress: string,
  collectionId?: string,
): Promise<Collection[]> => {
  let apiUrl = `${PSI_API_NFT_URL}/collections/${chainId}/${tokenAddress}`
  if (!isEmpty(collectionId)) apiUrl += `/${collectionId}`
  const response = await fetch(`${apiUrl}?withInfo=true`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

/**
 * @param accessToken login accessToken
 * @returns number of the latest user order nonce
 */
export const getOrderNonce = async (accessToken: string): Promise<number> => {
  const response = await fetch(`${PSI_API_NFT_URL}/users/getOrderNonce`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

/**
 * @param accessToken login accessToken
 * @returns signature for an order
 */
export const getOrderSignature = async (accessToken: string, orderId: number): Promise<string> => {
  const response = await fetch(`${PSI_API_NFT_URL}/order-signature/${orderId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

/**
 * @param accessToken login accessToken
 * @param order to add
 * @returns added order
 */
export const addOrders = async (accessToken: string, orders: Partial<Order>[]): Promise<Order[]> => {
  const response = await fetch(`${PSI_API_NFT_URL}/orders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ orders }),
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

/**
 * @param accessToken login accessToken
 * @param order to fullfill
 */
export const fulFillOrder = async (accessToken: string, chainId: number, orderId: number) => {
  const response = await fetch(`${PSI_API_NFT_URL}/orders/${chainId}/${orderId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fulFilled: true }),
  })
  if (!response.ok) throw new Error(await response.text())
}

/**
 * @param accessToken login accessToken
 * @param order to delete
 */
export const deleteOrder = async (accessToken: string, chainId: number, orderId: number) => {
  const response = await fetch(`${PSI_API_NFT_URL}/orders/${chainId}/${orderId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error(await response.text())
}

/**
 * @param accessToken login accessToken
 * @param files to add
 */
export const addFiles = async (
  accessToken: string,
  files: Blob[],
): Promise<{ metadata: IpfsMetadata; entries: { [id: string]: string } }> => {
  const data = new FormData()
  files.forEach((file) => data.append('files[]', file))

  const response = await fetch(`${PSI_API_NFT_URL}/files/IPFS`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  })
  if (!response.ok) throw new Error(await response.text())
  const result = await response.json()
  return result
}
