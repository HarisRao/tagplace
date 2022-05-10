import React from 'react'
import { Button } from 'components/Button'
import detailImg1 from '../../images/tagz/detail-1.png'
import detailImg2 from '../../images/tagz/detail-2.png'
import detailImg3 from '../../images/tagz/detail-3.png'
import detailImg4 from '../../images/tagz/detail-4.png'
import detailImg5 from '../../images/tagz/detail-5.png'
import ownerImg from '../../images/tagz/owner.png'
import tagzPriceImg from '../../images/tagz/tagz-currency-logo.png'
import walletImg from '../../images/tagz/wallet-white.png'
import Location from './location'

const images = [detailImg1, detailImg2, detailImg3, detailImg4, detailImg5]

const Nftdetail: React.FC = () => {
  return (
    <div className="container px-3 px-sm-0 my-5">
      <p className="mb-0 h3 font-weight-600">Sydney Opera House Zone</p>
      <div className="row mx-0 my-4">
        <div className="col-md-6 mb-3 mb-md-0 px-1 d-flex justify-content-center align-items-center">
          <img src={images[0]} alt="..." className="w-100" style={{ borderRadius: '8px' }} />
        </div>
        <div className="col-md-6 px-1">
          <div className="row mx-0">
            {images.slice(1).map((img) => {
              return (
                <div className="col-md-6 px-0 px-sm-1 mb-3 mb-md-2 d-flex justify-content-center align-items-center">
                  <img src={img} alt="..." className="w-100" style={{ borderRadius: '8px' }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="border-bottom-grey pb-4">
            <img src={ownerImg} alt="..." className="nft-owner" />
            <p className="ms-4 d-inline text-color">
              Created by<span className="font-weight-600 ps-2">Tod Hosswell</span>
            </p>
          </div>
          <div className="mt-4 border-bottom-grey pb-4">
            <p className="text-color mb-2 h4 font-weight-600">Description</p>
            <p className="grey-color mb-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris nulla lectus montes, mi. Amet
              ipsum, et, faucibus volutpat, lorem volutpat et pharetra, vitae. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Quisque mauris nulla lectus montes, mi. Amet ipsum, et, faucibus volutpat, lorem volutpat
              et pharetra, vitae.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="price-box p-3">
            <p className="mb-1 font-weight-600 grey-color font-size-14">Current Price</p>
            <p className="text-color h3">
              <img src={tagzPriceImg} className="me-2" alt="..." />3
              <span className="font-size-14 ms-2 font-weight-500 grey-color">($7,345,87)</span>
            </p>
            <Button className="mt-4 d-block w-100 text-center">
              <img src={walletImg} alt="..." className="me-1" />
              Buy now
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-9">
          <div className="mt-4">
            <p className="text-color mb-2 h4 font-weight-600">Location</p>
            <p className="grey-color mb-2">Sydney Opera House, Sydney, NSW</p>
            <Location />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Nftdetail
