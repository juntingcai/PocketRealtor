import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { updateProfile, getCurrentProfile } from "../../actions/profile";
import axios from "axios";
import {URL} from "../../utils/constants"
import Container from '@material-ui/core/Container';

import {Input, Button, TextField, Select} from "@material-ui/core"

const CreateListingPage = ({
  // profile: { profile, loading },
  // updateProfile,
  // getCurrentProfile,
  history,
  userId,
}) => {
  // console.log("profile++");
  // console.log(profile);
  const [formData, setFormData] = useState({
    user_id: null,
    title: "",
    type: "",
    age: null,
    description: "",
    address: "",
    city: "",
    state: "",
    zip_code: null,
    latitude: "37.7749",
    longitude: "-122.4194",
    sale_price: null,
    rent_price: null,
    area: null,
    rooms: null,
    bath_rooms: null,
    status: 1,
    furnitured: "No",
    garage: "No",
    backyard: "No",
    cooling: "No",
    heating: "No", 
    fireplace: "No"
  });

  const [file, setFile] = useState(null);

  const {
    title,
    type,
    age,
    description,
    address,
    city,
    state,
    zip_code,
    latitude,
    longitude,
    sale_price,
    rent_price,
    area,
    rooms,
    bath_rooms,
    status,
    furnitured,
    garage,
    backyard,
    cooling,
    heating, 
    fireplace
  } = formData;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false)
  

    
  console.log("verifyuser = ")
  console.log(userId)


  const createListing = async (newListing) => {
    const url = `${URL}/listing/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };


    const payload = {};
    payload.owner_id = userId;
    payload.title = title;
    payload.type = type;
    payload.age = parseInt(age);
    payload.description = description;
    payload.address = address;
    payload.city = city;
    payload.state = state;
    payload.zip_code = parseInt(zip_code);
    payload.latitude = latitude;
    payload.longitude = longitude;
    payload.sale_price = sale_price;
    payload.rent_price = rent_price;
    payload.area = area;
    payload.rooms = parseInt(rooms);
    payload.bath_rooms = parseInt(bath_rooms);
    payload.status = parseInt(status);
    // payload.furnitured = furnitured;
    // payload.garage = garage;
    // payload.backyard = backyard;
    // payload.cooling = cooling;
    // payload.heating = heating;
    // payload.fireplace = fireplace;

    const body = { property: payload };
    console.log("Demo ")
    console.log(body)
    try {
      const response = await axios.post(
        `${URL}/listing/create`,
        body,
        config
      );
      console.log("createListing post");
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };



  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(listings);
    if (listings.length > 0) {
      const listing = {
        title,
        type,
        age,
        description,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        sale_price,
        rent_price,
        area,
        rooms,
        bath_rooms,
        status,
        // furnitured,
        // garage,
        // backyard,
        // cooling,
        // heating, 
        // fireplace
      };

      var newListings = [];
      for (var i = 0; i < listings.length; i++) {
        console.log(listings[i]);
        newListings.push(listings[i]);
      }
      newListings.push(listing);

      console.log(newListings);

      createListing({ property: newListings });
    } else {
      var newListings = [];
      const listing = {
        title,
        type,
        age,
        description,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        sale_price,
        rent_price,
        area,
        rooms,
        bath_rooms,
        status,
        // furnitured,
        // garage,
        // backyard,
        // cooling,
        // heating, 
        // fireplace
      };

      newListings.push(listing);
      createListing({ property: newListings });
    }
  };

  const onFileChange = (e) => {
    setFile({ file: e.target.files[0] });
    console.log(e.target.files[0]);
  };

  return (
    <Fragment>
      <Container>
      <h1 className="medium text-primary">Create Listing</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <p>Listing Title:</p>
          <Input
          fullWidth
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Type of Property:</p>

          <select name="type" onChange={(e) => onChange(e)}>
            <option value=""></option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <p>Age of Property:</p>
          <Input
          fullWidth
            type="text"
            placeholder="How many years old is the property?"
            name="age"
            value={age}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Address:</p>
          <Input
          fullWidth
            type="text"
            placeholder="Address"
            name="address"
            value={address}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>City:</p>
          <Input
          fullWidth
            type="text"
            placeholder="City"
            name="city"
            value={city}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>State:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="State"
            name="state"
            value={state}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <p>Zip Code:</p>
          <div className="form-group">
            <Input
            fullWidth
              type="text"
              placeholder="Zip Code"
              name="zip_code"
              value={zip_code}
              onChange={(e) => onChange(e)}
            />
          </div>
        </div>

        {type && type !== "Apartment" ? (
          <div className="form-group">
            <p>Sale Price:</p>
            <br />
            <Input
            fullWidth
              type="text"
              placeholder="Interested in selling your property? Tell us your dream price"
              name="sale_price"
              value={sale_price}
              onChange={(e) => onChange(e)}
            />
            <br />
            <p>Rent Price:</p>
          </div>
        ) : (
          <div>
            <p>Rent Price:</p>
          </div>
        )}
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Rent Price"
            name="rent_price"
            value={rent_price}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Square Feet:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="How many sq. ft is the space?"
            name="area"
            value={area}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Number of Rooms:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Number of Rooms"
            name="rooms"
            value={rooms}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Number of Bath Rooms:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Number of Bath Rooms"
            name="bath_rooms"
            value={bath_rooms}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Description:</p>
          <TextField
          fullWidth
            placeholder="Describe your listing"
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
          ></TextField>
        </div>
        <br/>
        <p>Furnitured:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it come with furniture?"
            name="furnitured"
            value={furnitured}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Garage:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it have a garage?"
            name="garage"
            value={garage}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Backyard:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it have a backyard?"
            name="backyard"
            value={backyard}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Cooling:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it have air conditioning?"
            name="cooling"
            value={cooling}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Heating:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it have heating?"
            name="heating"
            value={heating}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Fireplace:</p>
        <div className="form-group">
          <Input
          fullWidth
            type="text"
            placeholder="Does it have a fireplace?"
            name="fireplace"
            value={fireplace}
            onChange={(e) => onChange(e)}
          />
        </div>
<br/>
        <h5>Add An Image</h5>
        <Input onChange={onFileChange} type="file" accept="image/*" />
        <br />
        <br />
        <Input type="submit" variant="contained" color="primary" />
        <br/>
        <br/>
        {/* <a className="btn btn-light my-1" href="/sell">
          Go Back
        </a> */}
        <Button  href="/sell">Back</Button>
      </form>
      </Container>
    </Fragment>
  );
};

CreateListingPage.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  userId: state.auth.id,
});

export default connect(mapStateToProps, {
  updateProfile,
  getCurrentProfile,
})(withRouter(CreateListingPage));
