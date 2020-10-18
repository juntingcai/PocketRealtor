import React, { Fragment } from 'react';
import '../ListItem.css';
/*
    prop : {
        
        id
        owner_id
        title
        introduction
        address
        state
        zip_code
        latitude
        longitude
        price
        rooms

    }
*/
const ListItem = (props) => {
    const picStyle = {
        background: 'url(' + require('../static/noimg.jpg') + ') center center',
        backgroundSize: 'cover'
    }
    return (
        <Fragment>
            <div className="property-card">
                <div className="picture-wrap" style={picStyle} />
                <div className="info-wrap">
                <div className="property-address">{props.data.address}</div>
                    <div className="property-title">{props.data.title}</div>
                    
                    <div className="property-rooms">
                        <span>{props.data.bedrooms} bedrooms</span>
                        <div className="divider"/>
                        <span>{props.data.bathrooms} baths</span>
                        <div className="divider"/>
                        <span>{props.data.area} sqft</span>
                    </div>
                    <div className="property-price">{props.data.price}</div>

                </div>
                
            </div>
        </Fragment>
    )
}

export default ListItem