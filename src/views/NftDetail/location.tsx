import React from 'react'
import GoogleMapReact from 'google-map-react'

const Marker = ({ text }) => <div>{text}</div>

const Location: React.FC = () => {
  const center = {
    lat: 59.95,
    lng: 30.33,
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        // key only restricted for https://localhost:3001
        bootstrapURLKeys={{ key: 'AIzaSyAUOodISobghTSX5MNpCCIhyAmiUQcA2K8' }}
        defaultCenter={center}
        defaultZoom={11}
      >
        <Marker text="My Marker" />
      </GoogleMapReact>
    </div>
  )
}
export default Location
