import { BigNumberish } from '@ethersproject/bignumber'
import { create } from 'ipfs-http-client'
import { PropertyCreationInformation, Metadata } from 'state/types'

export const getIPFSMetadata = (property: Partial<PropertyCreationInformation>): Metadata => {
  return {
    name: property.name,
    description: property.description,
    image: `{{image[0]}}`,
    background_color: '#ffffff',
    properties: {
      price: {
        name: 'Initial price',
        value: property.totalPrice?.toString(),
      },
      banner_images: property.uploadBannerImages.map((_, idx) => `{{image[${idx + 1}]}}`),
      property_type: {
        name: 'Property type',
        value: property.propertyType,
      },
      location: {
        name: 'Location',
        value: property.location,
      },
      bedrooms: {
        name: 'Bedrooms',
        value: property.bedrooms,
      },
      bathrooms: {
        name: 'Bathrooms',
        value: property.bathrooms,
      },
      size: {
        name: 'Size',
        value: property.size,
      },
      area: {
        name: 'Area',
        value: property.area,
      },
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export const addPropertyToIPFS = async (property: Partial<PropertyCreationInformation>, price: BigNumberish) => {
  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
  const uploadImageAdded = await client.add(property.uploadImage, { wrapWithDirectory: true })

  const uploadBannerImagesAdded: typeof uploadImageAdded[] = []
  // eslint-disable-next-line no-restricted-syntax
  for await (const file of client.addAll(property.uploadBannerImages)) {
    uploadBannerImagesAdded.push(file)
  }

  const metadata: Metadata = {
    name: property.name,
    description: property.description,
    image: `ipfs://${uploadImageAdded.path}`,
    external_url: `${window.location.origin}/property/${property.id}`,
    background_color: '#ffffff',
    properties: {
      price: {
        name: 'Initial price',
        value: price.toString(),
      },
      banner_images: uploadBannerImagesAdded.map((img) => `ipfs://${img.path}`),
      property_type: {
        name: 'Property type',
        value: property.propertyType,
      },
      location: {
        name: 'Location',
        value: property.location,
      },
      bedrooms: {
        name: 'Bedrooms',
        value: property.bedrooms,
      },
      bathrooms: {
        name: 'Bathrooms',
        value: property.bathrooms,
      },
      size: {
        name: 'Size',
        value: property.size,
      },
      area: {
        name: 'Area',
        value: property.area,
      },
    },
  }

  const metadataAdded = await client.add(JSON.stringify(metadata))
  return { ipfsUrl: `ipfs://${metadataAdded.path}`, metadata }
}
