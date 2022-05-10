import React from 'react'
import createandsell from '../../images/tagz/createandsell.png'

const CreateAndSell: React.FC = () => {
  return (
    <div className="row mb-5 pb-lg-4 mt-lg-4 text-center">
      <div className="col-sm-6 mb-3 mb-lg-0 col-lg-3">
        <img src={createandsell} className="mb-3" alt="..." />
        <p className="text-color h5">Create your content</p>
        <p style={{ color: '#939393' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="col-sm-6 mb-3 mb-lg-0 col-lg-3">
        <img src={createandsell} className="mb-3" alt="..." />
        <p className="text-color h5">Set up your wallet</p>
        <p style={{ color: '#939393' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="col-sm-6 mb-3 mb-lg-0 col-lg-3">
        <img src={createandsell} className="mb-3" alt="..." />
        <p className="text-color h5">Mint NFTs</p>
        <p style={{ color: '#939393' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="col-sm-6 mb-3 mb-lg-0 col-lg-3">
        <img src={createandsell} className="mb-3" alt="..." />
        <p className="text-color h5">List for sale</p>
        <p style={{ color: '#939393' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  )
}
export default CreateAndSell
