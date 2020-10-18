import React, { Fragment, useState, useEffect } from 'react'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


const Map = (props) => {
    const [loc, setLoc] = useState({
        lat: 0,
        lng: 0,
    })

    useEffect(() => {
        var lat = 0, lng = 0;
        geocodeByAddress(props.address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                lat = latLng.lat;
                lng = latLng.lng;

            })
            .catch(error => console.error('Error', error))
            .finally(() => {
                    setLoc({
                        lat: lat,
                        lng: lng,
                    })
                }
            )
        

    },[props.address])

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    // const center = {
    //     lat: props.data.lat,
    //     lng: props.data.lng
    // };

    const [selectProp, setSelectProp] = useState(null);


    // const [map, setMap] = useState(null)

    // const onLoad = React.useCallback(function callback(map) {
    //     const bounds = new window.google.maps.LatLngBounds();
    //     map.fitBounds(bounds);
    //     setMap(map)
    // }, [])

    // const onUnmount = React.useCallback(function callback() {
    //     setMap(null)
    // }, [])

    return (
        <Fragment>
            
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                        lat: loc.lat,
                        lng: loc.lng,
                    }}
                    zoom={12}
                    
                    
                >
                    {
                        props.list.map(item => (
                            <Marker
                                key={item.id}
                                position={
                                    {
                                        lat: item.latitude,
                                        lng: item.longitude
                                    }
                                }
                                onMouseOver={() => {setSelectProp(item)}}
                                onClick={() => {
                                    console.log("to details");
                                }}
                                
                            />
                        ))
                    }
                    {
                        selectProp && (
                            <InfoWindow
                                position={
                                    {
                                        lat: selectProp.latitude + 0.002,
                                        lng: selectProp.longitude
                                    }
                                }
                                onCloseClick={() => {
                                    setSelectProp(null);
                                }}
                            >
                                <div>
                                    {selectProp.price}
                                </div>

                            </InfoWindow>
                        )
                    }
                    <></>
                </GoogleMap>
            
        </Fragment>
    )

}

export default React.memo(Map)