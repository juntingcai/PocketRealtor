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

const ListItem = ({history, data}) => {
    const picStyle = {
        background: 'url(' + require('../static/noimg.jpg') + ') center center',
        backgroundSize: 'cover'
    }
    
    return (
        <Fragment>
            <div className="property-card" onClick={() => toPropertyDetail(history, data.id)}>
                <div className="picture-wrap" style={picStyle} />
                <div className="info-wrap">
                    <div className="property-address">{data.address + ", " + data.city}</div>
                    <div className="property-title">{data.title}</div>

                    <div className="property-rooms">
                        <span>{data.rooms} bedrooms</span>
                        <div className="divider" />
                        <span>{data.bath_rooms} baths</span>
                        <div className="divider" />
                        <span>{data.area} sqft</span>
                    </div>
                    <div className="property-price">
                        {formatter.format(data.sale_price)}
                        {/* {fomatPrice(props.sale? props.data.sale_price : props.data.rent_price)} */}
                    </div>

                </div>

            </div>
        </Fragment>
    )
}

export default withRouter(ListItem)