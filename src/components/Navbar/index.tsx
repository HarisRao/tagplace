import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar as BootstrapNavbar, Nav, Dropdown } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import { NavigationRouteObject } from 'routes'
import { useActiveWeb3React } from 'hooks/web3'
import Authenticate from 'components/Authenticate'
import Wallet from 'components/wallet/wallet'
import icon from '../../images/tagz/tagz-logo.png'

interface Props {
  routes: NavigationRouteObject[]
}

const Navbar: React.FC<Props> = ({ routes }) => {
  const { account } = useActiveWeb3React()

  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <BootstrapNavbar id="navigation" className="py-3 px-2 px-sm-4 bg-white" expand="lg">
      <BootstrapNavbar.Brand href="/" style={{ padding: 0 }}>
        <div className="d-flex align-items-center">
          <img src={icon} alt="..." />
          <p className="h5 ms-2">TagPlace</p>
        </div>
      </BootstrapNavbar.Brand>

      <BootstrapNavbar.Toggle color="white" onClick={toggleMenu} />

      <BootstrapNavbar.Collapse className="mobile-collapse-show pt-4 pt-lg-0 ">
        <div className="w-100 d-lg-flex justify-content-center">
          <div className="form-group has-search w-50 mb-2 mb-lg-0">
            <i className="fas fa-search search-icon" />
            <input
              type="text"
              placeholder="Search zones, tags, experiences, users"
              className="bg-transparent form-control navbar-search w-100"
            />
          </div>
        </div>

        <Nav className="d-flex align-items-lg-center">
          {routes.map((prop) => {
            if (!prop.name) return null
            return (
              <NavLink
                key={prop.path}
                to={prop.path}
                className={({ isActive }) => `nav-item nav-link ${isActive ? 'item' : ''} mb-1 mb-lg-0`}
              >
                {prop.name}
              </NavLink>
            )
          })}
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item nav-link ${isActive ? 'item' : ''} mb-1 mb-lg-0`}
          >
            <i className="far fa-user-circle" style={{ color: '#5F646C', fontSize: '22px' }} />
          </NavLink>

          <Authenticate />

          {/* <Wallet /> */}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  )
}

export default Navbar
