import React from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from 'routes'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

const Layout: React.FC = () => {
  const applicationRoutes = useRoutes(routes)

  return (
    <div className="wrapper">
      <div className="main-panel">
        <Navbar routes={routes} />
        {applicationRoutes}
        <Footer />
      </div>
    </div>
  )
}

export default Layout
