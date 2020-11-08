import React, { Fragment } from 'react';
import '../ListItem.css';
import { withRouter } from 'react-router-dom';
import { toPropertyDetail } from '../utils/functions';

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
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})

const ListItem = (props) => {
    const picStyle = {
        background: 'url(' + require('../static/noimg.jpg') + ') center center',
        backgroundSize: 'cover'
    }
    
    return (
        <Fragment>
            <div className="property-card" onClick={() => toPropertyDetail(props, props.data.id)}>
                <div className="picture-wrap" style={picStyle} />
                <div className="info-wrap">
                    <div className="property-address">{props.data.address + ", " + props.data.city}</div>
                    <div className="property-title">{props.data.title}</div>

                    <div className="property-rooms">
                        <span>{props.data.rooms} bedrooms</span>
                        <div className="divider" />
                        <span>{props.data.bath_rooms} baths</span>
                        <div className="divider" />
                        <span>{props.data.area} sqft</span>
                    </div>
                    <div className="property-price">
                        {formatter.format(props.data.sale_price)}
                        {/* {fomatPrice(props.sale? props.data.sale_price : props.data.rent_price)} */}
                    </div>

                </div>

            </div>
        </Fragment>
    )
}

export default withRouter(ListItem)