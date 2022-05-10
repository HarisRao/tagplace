import React from 'react'
import NftCard from '../../../components/nftcard/nftcard'

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const ArtGalleries: React.FC = () => {
  return (
    <div>
      <p className="mb-0 h2 text-color">Art Galleries</p>
      <p className="mb-4 font-weight-500 grey-color">(450 NFTs found)</p>
      <div className="row">
        {items.map(() => {
          return (
            <div className="col-sm-6 px-2 col-md-4 col-lg-3 mb-3">
              <NftCard />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ArtGalleries
