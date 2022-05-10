import { Button } from 'components/Button'
import React from 'react'
import { useLogin } from 'state/hooks'
import { NavLink } from 'react-router-dom'
import ProfileSettings from './ProfileSettings/ProfileSettings'
import tagzBlueLogo from '../../images/tagz/tagz-blue-logo.png'

const Profile: React.FC = () => {
  const { isLoggedIn } = useLogin()
  return (
    <div className="content">
      {!isLoggedIn ? (
        <div className="row mx-0 my-5" style={{ minHeight: '250px' }}>
          <div className="col-10 offset-1 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center mb-4 text-color">Log in</h3>
            <Button variant="text" style={{ borderRadius: '25px' }}>
              <img src={tagzBlueLogo} alt="..." className="pe-2" /> tagStorm account
            </Button>
            <p className="mt-4 grey-color text-center">
              By continuing, you acknowledge that you have read and understood, and agree to tagPlace{' '}
              <NavLink to="/termsandcondition" className="text-color">
                Terms of Service
              </NavLink>{' '}
              and{' '}
              <NavLink to="/privacypolicy" className="text-color">
                Privacy Policy
              </NavLink>
              .
            </p>
          </div>
        </div>
      ) : (
        <div className="col-md-12">
          <ProfileSettings />
        </div>
      )}

      {/* <div className="col-md-12">
        <ProfileSettings />
      </div> */}
    </div>
  )
}

export default Profile
