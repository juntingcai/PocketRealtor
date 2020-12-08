import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container"

import Button from "@material-ui/core/Button"

import {URL} from "../../utils/constants"
import axios from "axios"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const ListingsTable = (props) => {
  const classes = useStyles();
  return (<Fragment>
      {props.listings !== null && props.listings.length > 0 ? (
        <Fragment>
          <h3>Displaying {props.listings.length} Listings </h3>
          <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            {" "}
            <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Rent Per Room</TableCell>
              <TableCell><Button color="primary">Edit</Button></TableCell>
              <TableCell><Button color="secondary">Delete</Button></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            
              {props.listings.map((listing) => (
                <TableRow key={listing.address}>
                
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>{listing.address}</TableCell>
                  <TableCell>{listing.city}</TableCell>
                  <TableCell>{listing.state}</TableCell>
                  <TableCell>${listing.rent_price}</TableCell>
                  <TableCell><Button variant="contained" color="primary">Edit</Button></TableCell>
                  <TableCell><Button variant="contained" color="secondary">Delete</Button></TableCell>
                  {/* <TableCell><Button variant="contained" color="secondary" onClick={deleteListing(listing.id)}>Delete</Button></TableCell> */}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Fragment>
      ) : (
        <p>Displaying {props.listings.length} Listings </p>
      )}
    </Fragment>);
};

export default ListingsTable;
