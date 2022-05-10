import React from 'react'
import bannerCardImg from '../../images/tagz/banner-card.png'
import ownerCardImg from '../../images/tagz/card-owner-img.png'

const HomeBannerCard: React.FC = () => {
  return (
    <div className="banner-card">
      <img src={bannerCardImg} className="w-100 banner-card-img" alt="..." />
      <div className="m-2 d-flex align-items-center">
        <img src={ownerCardImg} className="card-owner-img" alt="..." />
        <div className="ms-2">
          <p className="blue-color font-size-14 font-weight-600 mb-0">3DWoel</p>
          <p className="text-color font-size-14 font-weight-600 mb-0">Sydney Opera House walkabouts</p>
        </div>
      </div>
    </div>
  )
}
export default HomeBannerCard
