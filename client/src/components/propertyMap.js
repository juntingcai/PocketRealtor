import React, { Fragment, useState, useEffect } from 'react'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';

const Map = (props) => {

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
                        lat: props.data.lat,
                        lng: props.data.lng,
                    }}
                    zoom={props.data.zoom}
                    
                    
                >
                    {
                        props.data.list.map(item => (
                            <Marker
                                key={item.id}
                                position={
                                    {
                                        
                                        lat: Number(item.latitude),
                                        lng: Number(item.longitude)
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
                                        lat: Number(selectProp.latitude) + 0.001,
                                        lng: Number(selectProp.longitude)
                                    }
                                }
                                onCloseClick={() => {
                                    setSelectProp(null);
                                }}
                            >
                                <div>
                                    {selectProp.sale_price}
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