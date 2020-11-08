import React, { Fragment, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from './ListItem'
import Map from './propertyMap';
import SearchFilter from './SearchBarItems/SearchFilter'
import PlaceAutoComplete from './PlaceAutoComplete'
import axios from "axios";
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import './../css/List.css';

const PropertyList = (props) => {


    const [list, setList] = useState(Array);
    const [placeValue, setPlaceValue] = useState('');
    const [inputValue, setInputValue] = useState({
        addr: '',
        lat: 0,
        lng: 0,
        radius: 5,
        type: 0,
        minPrice: 0,
        maxPrice: 0,
        numBedrm: 0,
        numbatrm: 0,
    });



    const fetchProperties = (address, type) => {
        var lat, lng
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                lat = latLng.lat;
                lng = latLng.lng;
                setInputValue({
                    ...inputValue,
                    addr: address,
                    lat: lat,
                    lng: lng,
                })
                console.log(inputValue.lat, inputValue.lng)

            })
            .catch(error => {

                setInputValue({
                    ...inputValue,
                    addr: "San Francisco, CA, USA",
                    lat: 37.7448,
                    lng: -122.425
                })

                console.error('Fetch Geocode Error: ' + address, error);
            }).finally(() => {
                //http://52.53.200.228:3080
                var url = "http://52.53.200.228:3080/listings" +
                    "?type=" + type +
                    "&lat=" + lat +
                    "&lng=" + lng +
                    "&radius=" + inputValue.radius;
                if (inputValue.minPrice != 0 && inputValue.maxPrice != 0) {
                    url += "&minPrice=" + inputValue.minPrice + "&maxPrice=" + inputValue.maxPrice;
                }
                if (inputValue.numBedrm != 0)
                    url += "&bedrooms=" + inputValue.numBedrm;
                if (inputValue.numbatrm != 0)
                    url += "&bathrooms=" + inputValue.numbatrm;
                console.log(url)
                axios.get(url)
                    .then((res) => {
                        if (res.data)
                            setList(res.data)
                    }).catch((err) => {
                        console.log(err);
                    })
            })
    }


    useEffect(() => {
        console.log("history: " + props.history.location.state.address)
        console.log("type: " + props.history.location.state.type)
        var setType = (props.history.location.state.type) ? props.history.location.state.type : 0;
        var setAddr = (props.history.location.state.address) ? props.history.location.state.address : 'San Francisco, CA, USA';
        setInputValue({
            ...inputValue,
            addr: setAddr,
            type: setType
        });

        setPlaceValue(setAddr);
        console.log("setAddr: " + props.history.location.state.address)
        fetchProperties(setAddr, setType);


    }, [])


    const simpleAddr = () => {
        var res = "Properties in ";
        var index = inputValue.addr.indexOf(",");
        if (index == -1)
            return res + inputValue.addr;
        else
            return res + inputValue.addr.substring(0, index);

    }


    const onSearch = async () => {

        fetchProperties(placeValue);
    }
    const onSelectPrice = (min, max) => {
        console.log(min, max);
        setInputValue({
            ...inputValue,
            minPrice: parseInt(min),
            maxPrice: parseInt(max)
        })
    }
    const onSelectRoom = (bed, bath) => {
        console.log(bed, bath);
        setInputValue({
            ...inputValue,
            numBedrm: bed,
            numbatrm: bath
        })
    }

    return (
        <Fragment>
            <div id="property-list">
                <div className="search-bar-wrap">
                    <div className="place-input-box">
                        <div className="place-input-box-wrap">
                            <PlaceAutoComplete value={placeValue} setValue={setPlaceValue} />
                        </div>
                    </div>

                    <SearchFilter onSelectPrice={onSelectPrice} onSelectRoom={onSelectRoom} />


                    <Button variant="contained" onClick={onSearch} className="theme-color-bg" disableElevation>
                        Search
                    </Button>
                </div>
                <div className="content-wrap">
                    <div className="map-wrap">
                        <Map data={{
                            lat: inputValue.lat,
                            lng: inputValue.lng,
                            list: list,
                            zoom: 12,
                        }} />
                    </div>
                    <div className="list-wrap">
                        <div className="title">{simpleAddr()}</div>
                        {
                            list.map(item => (
                                <ListItem key={item.id} data={item} sale={true} />
                            ))
                        }
                    </div>
                </div>
            </div>

        </Fragment>
    )
}

export default PropertyList