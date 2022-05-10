import React, { useState } from 'react'
import { Modal } from 'reactstrap'
import CopyToClipboard from 'components/WalletModal/CopyToClipboard'
import Drawer from 'react-modern-drawer'
import walletimg from '../../images/tagz/wallet.png'
import tagzpricelogo from '../../images/tagz/tagzpriceorangelogo.png'
import { Button } from '../Button/index'
import './wallet.css'
import 'react-modern-drawer/dist/index.css'

const Wallet: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <div>
      <button type="button" className="btn p-0 wallet-btn" onClick={toggleDrawer}>
        <img src={walletimg} alt="..." className="wallet-icon" />
      </button>
      <Drawer open={isOpen} className="tagz-wallet" onClose={toggleDrawer} direction="right">
        <div className="py-5">
          <div>
            <p className="text-color text-center h1 mb-2">My Wallet</p>
            <div className="d-flex justify-content-center">
              <CopyToClipboard toCopy="0x50d43e020x50d43e020">0x50d4...3e02</CopyToClipboard>
            </div>
          </div>
          <div className="balance-div p-4 m-5">
            <p className="grey-color text-center mb-3">Balance</p>
            <p className="h4 text-center">
              <img src={tagzpricelogo} alt="..." className="mr-1" /> 0.000 TAGD
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <Button className="px-5">BUY TAGD</Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
export default Wallet
