import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ListingsTable = (props) => {
  return (
    <Fragment>
      {props.listings !== null && props.listings.length > 0 ? (
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
                <td>{listing.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Displaying {props.listings.length} Listings </p>
      )}
    </Fragment>
  );
};

export default ListingsTable;
