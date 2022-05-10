import React from 'react'
import styled from 'styled-components'
import omniloader from '../../images/omniloader.gif'
import tagzloader from '../../images/tagz/footer-logo.png'

const Container = styled.div`
  position: relative;
`

export interface SpinnerProps {
  size?: number
}

const Spinner: React.FC<SpinnerProps> = ({ size = 150 }) => {
  return (
    <Container>
      {/* https://psi.blob.core.windows.net/images/Spinner.gif */}
      <img src={tagzloader} alt="tagz-loader" style={{ width: `${size}px`, height: `${size}px` }} />
    </Container>
  )
}

export default Spinner
