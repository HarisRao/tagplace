import React from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import nftimage from '../../images/tagz/nft-image.png'
import nftOwner from '../../images/tagz/nft-owner.png'
import tagzPriceImg from '../../images/tagz/tagzpriceorangelogo.png'

const NftCard: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Card className="border-8">
        <Card.Img variant="top" className="nft-img" src={nftimage} />
        <Card.Body>
          <div className="d-flex">
            <img src={nftOwner} alt="..." className="nftcard-owner-img" />
            <div className="ms-2">
              <span className="font-size-14 blue-color font-weight-500">Username</span>
              <p className="mb-0 h5 text-color font-weight-600 nft-name">NFT Name</p>
            </div>
          </div>
          <p className="text-color mt-3 h5">
            <img src={tagzPriceImg} className="me-2" alt="..." />
            3.3
            <span className="font-size-14 ms-2 font-weight-500 grey-color">($7,345,87)</span>
          </p>
          <div className="d-flex justify-content-between">
            <div className="text-color">Melbourne, Vic</div>
            <div
              className="grey-color pointer text-decor"
              role="button"
              onKeyDown={() => navigate('/nftdetail')}
              tabIndex={0}
              onClick={() => navigate('/nftdetail')}
            >
              Details/Buy
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
export default NftCard
