import React from 'react'
import ExperienceCard from 'components/experiencesCard/experiencecard'
import HomeBannerCard from './HomeBannercard'
import { Button } from '../../components/Button/index'
import tagVideoicon from '../../images/tagz/tag-video-icon.png'
import './Home.css'
import HomeMiddleSection from './HomeMiddlesection'
import CreateAndSell from './createAndSell'

const items = [1, 2, 3]

const Home: React.FC = () => {
  return (
    <div className="container-fluid px-0">
      <div className="home-banner-orange-section" />
      <div className="container">
        <div className="row mx-0 mt-4">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <p className="ms-lg-5 ps-xl-5 font-size-50 text-color line-height-48">
              Discover, collect
              <br />
              and sell amazing
              <br />
              experiences
            </p>
            <p className="ms-lg-5 ps-xl-5 mb-0 grey-color">
              tagPlace is where the world and mixed reality meet, in the first and largest AR marketplace
            </p>
            <div className="mt-3 ms-lg-5 ps-xl-5">
              <Button variant="primary" className="mb-3">
                Explore
              </Button>
              <Button variant="secondary" className="ms-4">
                Create
              </Button>
              <p className="mb-0 tagz-color font-weight-600">
                <img src={tagVideoicon} className="me-1" alt="..." /> Learn more about tagPlace
              </p>
            </div>
          </div>
          <div className="col-lg-6 banner-card-div mb-5 mb-lg-0">
            <HomeBannerCard />
          </div>
        </div>

        <HomeMiddleSection />

        <div className="my-5">
          <p className="text-color h4 font-weight-600">Top New Experiences</p>
          <div className="row mx-0 mt-3">
            {items.map(() => {
              return (
                <div className="col-sm-6 px-0 px-sm-2 mb-3 mb-lg-0 col-lg-4">
                  <ExperienceCard />
                </div>
              )
            })}
          </div>
        </div>

        <CreateAndSell />
      </div>
    </div>
  )
}

export default Home
