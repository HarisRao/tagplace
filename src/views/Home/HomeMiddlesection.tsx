import { Button } from 'components/Button'
import React from 'react'
import styled from 'styled-components'
import { Player, BigPlayButton, ControlBar } from 'video-react'
import homevid from '../../images/viviangardens.mp4'
import homeimg from '../../images/tagz/homevideoposter.png'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgGrey};
  padding: 20px;
  border-radius: 14px;
`

const HomeMiddleSection: React.FC = () => {
  return (
    <Wrapper>
      <div>
        <div className="row mx-0">
          <div className="col-10 offset-1 col-sm-8 col-offset-2 col-lg-4 offset-lg-4 mb-4">
            <p className="text-center h3 text-color">Meet tagPlace</p>
            <p className="text-center grey-color">
              tagPlace is where the world and mixed reality meet, in the first and largest AR marketplace
            </p>
          </div>
        </div>

        <div className="home-video-section">
          <Player playinline poster={homeimg} src={homevid}>
            <BigPlayButton position="center" />
            <ControlBar autoHide={false} className="my-class" />
          </Player>
        </div>

        <div className="d-flex justify-content-center my-4">
          <Button variant="primary">Explore Marketplace</Button>
        </div>
      </div>
    </Wrapper>
  )
}
export default HomeMiddleSection
