import React, { Fragment, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from './ListItem'
import Map from './propertyMap';
import SearchFilter from './SearchBarItems/SearchFilter'
import SearchInput from './SeachInput'

 
import './../property.css';

import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

const PropertyList = (props) => {


    const list = [
        {
            id: 1,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7448,
            longitude: -122.425,
            
        },
        {
            id: 2,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7149,
            longitude: -122.44,
        },
        {
            id: 3,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7541,
            longitude: -122.4601,
        },
        {
            id: 4,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7555,
            longitude: -122.4786,
            
        },
        {
            id: 5,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7540,
            longitude: -122.408,
        },
        {
            id: 6,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7618,
            longitude: -122.449,
        },
        {
            id: 7,
            title: 'Spacious Home in Brisbane, 10 miles south of SF',
            address: '1937 23rd Ave, San Francisco, CA 94116',
            price: '$1,695,000',
            bedrooms: 3,
            bathrooms: 2,
            area: "2,480",
            latitude: 37.7550,
            longitude: -122.445,
        }
    ];
    const [address, setAddress] = useState('')
    const [inputValue, setInputValue] = useState({
        addr: '',
        minPrice: 0,
        maxPrice: 0,
        numBedrm: 0,
        numbatrm: 0,
    });

    

    useEffect(() => {
        var setAddr = (props.history.location.state.address)? props.history.location.state.address : 'San Francisco, CA, USA';
        setInputValue({ 
            ...inputValue,
            addr: setAddr
        });
        setAddress(setAddr);
        

    },[])

    

    

    const onSearch = async () => {
        console.log(inputValue)
        setAddress(inputValue.addr)
        // e.preventDefault();
        // try {
        //     const body = {
        //         data: {
        //             title: inputValue
        //         }
        //     }
        //     const response = await fetch("http://localhost:8080/list", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(body)
        //     });
        //     console.log(response);
        //     window.location = '/';

        // } catch (error) {
        //     console.error(error.message);
        // }
    }
    const onSelectPrice = (min, max) =>{
        console.log(min, max);
    }
    const onSelectRoom = (bed, bath) => {
        console.log(bed, bath);
    }
    const onSelectAddr = (address) => {
        setInputValue({
            ...inputValue,
            addr: address
        })
    }
    

    return (
        <Fragment>
            <div className="property-wrap">
                <div className="search-bar-wrap">
                    <div id="search-input-in-property-list">
                        <SearchInput data={{home: false}} onSelectAddr={onSelectAddr} />
                    </div>
                    {/* <input
                        type="text"
                        placeholder="City, Neighborhood"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    /> */}
                    {/* <Button variant="outlined" color="secondary" onClick={selectPrice}>
                        price
                    </Button> */}
                    <SearchFilter onSelectPrice={onSelectPrice} onSelectRoom={onSelectRoom}/>
                    
                    
                    <Button variant="contained" onClick={onSearch} className="theme-color-bg" disableElevation>
                        Search
                    </Button>
                </div>
                <div className="content-wrap">
                    <div className="map-wrap">
                        <Map address={address} list={list}/>
                    </div>
                    <div className="list-wrap">
                        <div className="title">Properties in {address}</div>
                        {
                            list.map(item => (
                                <ListItem key={item.id} data={item}/>
                            ))
                        }
                    </div>
                </div>
            </div>
            
        </Fragment>
    )
}

export default PropertyList