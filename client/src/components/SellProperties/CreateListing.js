import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { updateProfile, getCurrentProfile } from "../../actions/profile";

const CreateListing = ({
  profile: { profile, loading },
  updateProfile,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    latitude: "37.7749N",
    longitude: "122.4194W",
    price: "",
    rooms: "",

    is_host: true,
  });

  const {
    title,
    introduction,
    address,
    city,
    state,
    zip_code,
    latitude,
    longitude,
    price,
    rooms,

    is_host,
  } = formData;

  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      if (profile.data.listings.length > 0) {
        var temp = [];
        for (var i = 0; i < profile.data.listings.length; i++) {
          temp.push(profile.data.listings[i]);
        }
        setListings(temp);
      }
    }
  }, [loading, getCurrentProfile, profile]);

  console.log(listings);

  console.log(is_host);
  if (!is_host) {
    history.push("/dashboard");
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
        introduction,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        price,
        rooms,
      };

      var newListings = [];
      for (var i = 0; i < listings.length; i++) {
        console.log(listings[i]);
        newListings.push(listings[i]);
      }
      newListings.push(listing);

      console.log(newListings);

      updateProfile({ listings: newListings });
    } else {
      var newListings = [];
      const listing = {
        title,
        introduction,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        price,
        rooms,
      };
      newListings.push(listing);
      updateProfile({ listings: newListings });
    }
  };

  return (
    <Fragment>
      {" "}
      <h1 className="medium text-primary">Create Listing</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <p>Title:</p>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
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
        <p>Rent Price:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Rent Price"
            name="price"
            value={price}
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
        <div className="form-group">
          <p>Description:</p>
          <textarea
            placeholder="Describe your listing"
            name="introduction"
            value={introduction}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-success my-1" />
        <a className="btn btn-light my-1" href="/dashboard">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

CreateListing.propTypes = {
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
})(withRouter(CreateListing));
