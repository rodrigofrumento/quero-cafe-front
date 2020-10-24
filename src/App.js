import React, { Fragment, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import EstablishmentsService from './services/establishments_service'
import Establishment from './components/Establishment/index'

function App() {
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [locations, setLocation] = useState([])
  const [selected, setSelected] = useState({})
  const { REACT_APP_GOOGLE_API_KEY } = process.env

  useEffect(() => {
    setCurrentLocation()
  }, )

  async function loadCoffeeShops() {
    const response = await EstablishmentsService.index(latitude, longitude)
    setLocation(response.data.results)
  }

  async function setCurrentLocation() {
    await navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      loadCoffeeShops()
    }, function(error) {
      alert('Habilite a localização para usar o app')
    })
  }

  return (
    <Fragment>
      <LoadScript googleMapsApiKey={ REACT_APP_GOOGLE_API_KEY }>
        <GoogleMap mapContainerStyle={{height: '100vh', width: '100%'}}
          zoom={15}
          center={{lat: latitude, lng: longitude}}
        >
          {
            locations.map((item, index) => {
              return(
                <Marker key={index} icon="/images/coffee-pin.png" title={item.name} animation="4" 
                        position={{lat: item.geometry.location.lat, lng: item.geometry.location.lng}}
                        onClick={() => setSelected(item)}
                />
              )})
          }
          {
            selected.place_id && (
              <Establishment place={selected} />
            )
          }
          <Marker key="my location" icon="/images/my-location-pin.png" title="estou aqui" animation="2"
                  position={{lat: latitude, lng: longitude}} />
        </GoogleMap>
      </LoadScript>
    </Fragment>
  );
}

export default App;
