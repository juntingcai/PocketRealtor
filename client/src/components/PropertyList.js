import React, { Fragment, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from './ListItem'
import Map from './GoogleMap';
import SearchFilter from './SearchBarItems/SearchFilter'
import PlaceAutoComplete from './PlaceAutoComplete'
import { searchProperties, getSimilarNearby } from '../utils/functions';
import axios from "axios";
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import './../css/List.css';
import ClockType from '@material-ui/pickers/constants/ClockType';
import Loading from '../utils/Loading';

const PropertyList = (props) => {


    const [list, setList] = useState([]);
    const [subList, setSubList] = useState([]);
    const [placeValue, setPlaceValue] = useState('');
    const [searchProps, setSearchProps] = useState({
        //const [inputValue, setInputValue] = useState({
        addr: null,
        lat: 0,
        lng: 0,
        radius: 10,
        type: 0,
        minPrice: 0,
        maxPrice: 0,
        bedrooms: 0,
        bathrooms: 0,
    });


    const setAddrProps = (address, type) => {
        if (!address || address === null) return;
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                setSearchProps({
                    ...searchProps,
                    type: type,
                    addr: address,
                    lat: latLng.lat,
                    lng: latLng.lng,
                })
            })
            .catch(error => {
                setSearchProps({
                    ...searchProps,
                    type: 0,
                    addr: "San Francisco, CA, USA",
                    lat: 37.7448,
                    lng: -122.425
                })
                console.error(error);
            })
    }



    useEffect(() => {
        console.log("history: " + props.history.location.state.address)
        console.log("type: " + props.history.location.state.type)
        if (searchProps.addr === null) {
            const type = props.history.location.state.type;
            const address = props.history.location.state.address;
            setAddrProps(address, type);
        }
        if (searchProps.addr !== null)
            searchProperties(searchProps)
            .then(list => {
                
                setList(list)
                if(list.length === 0){
                    getSimilarNearby(searchProps, setSubList)
                }
                
            })
            
        

    }, [searchProps])


    const simpleAddr = () => {
        var res = "Properties in ";
        var index = searchProps.addr.indexOf(",");
        if (index == -1)
            return res + searchProps.addr;
        else
            return res + searchProps.addr.substring(0, index);

    }


    const onSearch = () => {
        setAddrProps(placeValue, searchProps.type);
    }
    const onSelectPrice = (min, max) => {
        console.log(min, max);
        setSearchProps({
            ...searchProps,
            minPrice: parseInt(min),
            maxPrice: parseInt(max)
        })
    }
    const onSelectRoom = (bed, bath) => {
        console.log(bed, bath);
        setSearchProps({
            ...searchProps,
            bedrooms: bed,
            bathrooms: bath
        })
    }

    return (
        <Fragment>

            <div id="property-list">
                {searchProps.addr === null ? <Loading /> : <>
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
                                lat: searchProps.lat,
                                lng: searchProps.lng,
                                list: list,
                                zoom: 12,
                            }} />
                        </div>
                        <div className="list-wrap">
                            <div className="title">{simpleAddr()}</div>
                            {
                                list.length === 0 ?
                                    <>
                                        <div className="empty-list">
                                            <div className="text">
                                                {"Sorry, we can't find any result in this area. Try other places or eliminate filters"}
                                            </div>
                                        </div>
                                        {
                                            subList && subList.map(item => (
                                                <ListItem key={item.id} data={item} sale={true} />
                                            ))
                                        }
                                        
                                    </> :
                                    <>
                                        {list.map(item => (
                                            <ListItem key={item.id} data={item} sale={true} />
                                        ))}
                                    </>
                            }
                        </div>
                    </div>
                </>}
            </div>

        </Fragment>
    )
}

export default PropertyList