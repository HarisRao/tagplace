import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import tagz from '../../images/tagz/footer-logo.png'
import twitter from '../../images/tagz/twitter.png'
import insta from '../../images/tagz/insta.png'
import facebook from '../../images/tagz/facebook.png'
import youtube from '../../images/tagz/youtube.png'

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.bgGrey};
  color: ${({ theme }) => theme.colors.text};
`

const Footer: React.FC = () => (
  <Wrapper>
    <div className="row mx-0 text-center text-sm-start p-5">
      <div className="col-sm-8 mb-4 col-lg-6">
        <div className="d-flex justify-content-center justify-content-sm-start align-items-end">
          <img src={tagz} alt="..." />
          <p className="mb-0 ms-3 font-size-50">tagPlace</p>
        </div>
        <div className="mt-4">
          <i className="far fa-envelope footer-icon" />
          <span className="ps-3 mail-font">admin@tagplace.com</span>
        </div>
      </div>
      <div className="col-sm-4 mb-4 col-lg-2">
        <p className="footer-ul-header mb-3">About Us</p>
        <ul className="footer-ul">
          <li className="mb-2">
            <NavLink to="/" className="text-color text-decor-none">
              Home
            </NavLink>
          </li>
          <li className="mb-2">Rankings</li>
          <li className="mb-2">
            <NavLink to="/termsandcondition" className="text-color text-decor-none">
              Terms
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/privacypolicy" className="text-color text-decor-none">
              Privacy Policy
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="col-sm-8 mb-4 col-lg-2">
        <p className="footer-ul-header mb-3">Marketplace</p>
        <ul className="footer-ul">
          <NavLink to="/create" className="text-color text-decor-none">
            <li className="mb-2">Create NFT</li>
          </NavLink>
          <li className="mb-2">Mt Account</li>
          <NavLink to="/explore" className="text-color text-decor-none">
            <li className="mb-2">Marketplace</li>
          </NavLink>
        </ul>
      </div>
      <div className="col-sm-4 mb-4 col-lg-2">
        <p className="footer-ul-header mb-3">Join Community</p>
        <ul className="footer-ul d-flex justify-content-center justify-content-sm-start">
          <li className="pe-3">
            <a href="https://twitter.com" rel="noreferrer" target="_blank">
              <img src={twitter} alt="..." className="pointer" />
            </a>
          </li>
          <li className="pe-3">
            <a href="https://instagram.com" rel="noreferrer" target="_blank">
              <img src={insta} alt="..." className="pointer" />
            </a>
          </li>
          <li className="pe-3">
            <a href="https://facebook.com" rel="noreferrer" target="_blank">
              <img src={facebook} alt="..." className="pointer" />
            </a>
          </li>
          <li className="pe-3">
            <a href="https://youtube.com" rel="noreferrer" target="_blank">
              <img src={youtube} alt="..." className="pointer" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </Wrapper>
)

export default Footer
