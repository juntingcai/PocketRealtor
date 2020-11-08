import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ListingsTable = (props) => {
  return (
    <Fragment>
      {props.listings !== null && props.listings.length > 0 ? (
        <Fragment>
          <p>Displaying {props.listings.length} Listings </p>
          <table>
            {" "}
            <thead>
              <th>Title</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Rent Per Room</th>
            </thead>
            <tbody>
              {props.listings.map((listing) => (
                <tr key={listing.address}>
                  <td>{listing.title}</td>
                  <td>{listing.address}</td>
                  <td>{listing.city}</td>
                  <td>{listing.state}</td>
                  <td>${listing.rent_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      ) : (
        <p>Displaying {props.listings.length} Listings </p>
      )}
    </Fragment>
  );
};

export default ListingsTable;
