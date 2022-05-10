import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Home = lazy(() => import('./views/Home'))
const Create = lazy(() => import('./views/CreateNft'))
const NftDetail = lazy(() => import('./views/NftDetail'))
const Explore = lazy(() => import('./views/Explore'))

const Profile = lazy(() => import('./views/Profile'))
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy'))
const TermsAndCondition = lazy(() => import('./views/TermsAndCondition'))

const NotFound = lazy(() => import('./views/NotFound'))

export interface NavigationRouteObject extends RouteObject {
  name?: string
}

export const routes: NavigationRouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/explore',
    name: 'Explore',
    element: <Explore />,
  },
  {
    path: '/create',
    name: 'Create',
    element: <Create />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/nftdetail',
    element: <NftDetail />,
  },
  {
    path: '/termsandcondition',
    element: <TermsAndCondition />,
  },
  {
    path: '/privacypolicy',
    element: <PrivacyPolicy />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]
