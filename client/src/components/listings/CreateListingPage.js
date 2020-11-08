import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { updateProfile, getCurrentProfile } from "../../actions/profile";
import axios from "axios";

const CreateListingPage = ({
  profile: { profile, loading },
  updateProfile,
  getCurrentProfile,
  history,
}) => {
  console.log("profile++");
  console.log(profile);
  const [formData, setFormData] = useState({
    user_id: null,
    title: "",
    type: "",
    age: null,
    description: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    latitude: "37.7749N",
    longitude: "122.4194W",
    sale_price: null,
    rent_price: null,
    area: null,
    rooms: null,
    bath_rooms: null,
    is_host: true,
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
    is_host,
  } = formData;

  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      if (profile.data.listings.length > 0) {
        var temp = [];
        setListings(temp);
      }
    }
  }, [loading, getCurrentProfile, profile]);

  const createListing = async (newListing) => {
    const url = "http://localhost:5000/listing/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const user_id = profile.data.id;
    setFormData({ user_id });
    const payload = {};
    payload.user_id = user_id;
    payload.title = title;
    payload.type = type;
    payload.age = age;
    payload.description = description;
    payload.address = address;
    payload.city = city;
    payload.state = state;
    payload.zip_code = zip_code;
    payload.latitude = latitude;
    payload.longitude = longitude;
    payload.sale_price = sale_price;
    payload.rent_price = rent_price;
    payload.area = area;
    payload.rooms = rooms;
    payload.bath_rooms = bath_rooms;
    payload.is_host = is_host;

    const body = { property: payload };
    try {
      const response = await axios.post(
        "http://localhost:5000/listing/create",
        body,
        config
      );
      console.log("createListing post");
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(is_host);
  if (!is_host) {
    history.push("/");
  }

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
      {" "}
      <h1 className="medium text-primary">Create Listing</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <p>Listing Title:</p>
          <input
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
          <input
            type="text"
            placeholder="How many years old is the property?"
            name="age"
            value={age}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Address:</p>
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={address}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>City:</p>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={city}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>State:</p>
        <div className="form-group">
          <input
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
            <input
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
            <input
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
          <input
            type="text"
            placeholder="Rent Price"
            name="rent_price"
            value={rent_price}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Square Feet:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="How many sq. ft is the space?"
            name="area"
            value={area}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Number of Rooms:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Number of Rooms"
            name="rooms"
            value={rooms}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Number of Bath Rooms:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Number of Bath Rooms"
            name="bath_rooms"
            value={bath_rooms}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Description:</p>
          <textarea
            placeholder="Describe your listing"
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <br />

        <h5>Add An Image</h5>
        <input onChange={onFileChange} type="file" accept="image/*" />
        <br />
        <br />
        <input type="submit" className="btn btn-success my-1" />

        <a className="btn btn-light my-1" href="/createlisting">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

CreateListingPage.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  updateProfile,
  getCurrentProfile,
})(withRouter(CreateListingPage));
