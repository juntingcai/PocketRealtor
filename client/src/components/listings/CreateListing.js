import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "../dashboard/DashboardActions";

import ListingsTable from "../listings/ListingsTable";

import Axios from "axios";
import SearchTenants from "../tenants/SearchTenants";
const CreateListing = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  const [tenantsData, setTenantsData] = useState([]);
  const [listingsData, setListingsData] = useState([]);
  const getTenants = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/tenants");
      const tenants = response.data;

      setTenantsData(tenants);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getListings = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/listings");
      const listings = response.data;
      console.log("Listings:");
      console.log(listings);
      setListingsData(listings);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCurrentProfile();
    console.log("now tenants");
    getTenants();
    getListings();
  }, []);

  console.log(`profile=-=`);
  console.log(profile);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {profile !== null && profile.data.is_host ? (
        <Fragment>
          <h3>Host Portal</h3>
          <Link to="/newlisting" className="btn btn-success my-1">
            Post New Listing
          </Link>
          <ListingsTable
            listings={listingsData.filter(
              (listing) => listing.user_id === "" + profile.data.id
            )}
          />
        </Fragment>
      ) : (
        <Fragment>
          <p></p>
        </Fragment>
      )}
    </Fragment>
  );
};

CreateListing.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(CreateListing);
