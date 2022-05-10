import { isUndefined } from 'lodash'
import { Order, PropertyCollection, PropertyInformation, Metadata, MetadataProperty } from 'state/types'

export const convertOrder = (order: Order) => {
  const metadata: Metadata = JSON.parse(order.mintData)
  const collectionId = parseInt(order.subCollectionId)
  const tokenId = parseInt(order.tokenId)
  return convertMetadata(metadata, collectionId, tokenId)
}

export const convertMetadata = (metadata: Metadata, collectionId: number, tokenId?: number) => {
  const information: PropertyInformation = {
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    bannerImages: metadata?.properties?.banner_images as string[],
    propertyType: (metadata?.properties?.property_type as MetadataProperty)?.value as string,
    location: (metadata?.properties?.location as MetadataProperty)?.value as string,
    bedrooms: (metadata?.properties?.bedrooms as MetadataProperty)?.value as number,
    bathrooms: (metadata?.properties?.bathrooms as MetadataProperty)?.value as number,
    size: (metadata?.properties?.size as MetadataProperty)?.value as string,
    area: (metadata?.properties?.area as MetadataProperty)?.value as string,
  }

  if (!Number.isNaN(parseFloat(information?.size.toString() ?? ''))) information.size = `${information.size} m2`

  const collection: PropertyCollection = {
    ...information,
    id: collectionId,
    totalPrice: (metadata?.properties?.price as MetadataProperty)?.value as string,
    properties: {},
  }

  if (!isUndefined(tokenId)) {
    collection.properties[tokenId] = {
      ...information,
      id: tokenId,
      collectionId,
      price: (metadata?.properties?.price as MetadataProperty)?.value as string,
    }
  }

  return collection
}
