import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import '../../TenantTable.css';

// import ListingsTable from "../listings/ListingsTable";

import Axios from "axios";
import SearchTenants from "../tenants/SearchTenants";
const Dashboard = (
  {
    // getCurrentProfile,
    // auth: { user },
    // profile: { profile, loading },
  }
) => {
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [listingsData, setListingsData] = useState([]);
  const getTenants = async () => {
    try {
      const response = await Axios.get("http://52.53.200.228:3080/tenants");
      const tenants = response;
      console.log(tenants);
      setTenantsData(tenants.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const getListings = async () => {
  //   try {
  //     const response = await Axios.get("http://localhost:5000/listings");
  //     const listings = response.data;
  //     console.log("Listings:");
  //     console.log(listings);
  //     setListingsData(listings);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  useEffect(() => {
    // getCurrentProfile(user.id);
    setLoading(true);
    console.log("now tenants");
    getTenants();
    console.log("tenantsData");
    console.log(tenantsData);
    setLoading(false);
    // getListings();
  }, []);

  // return loading && profile === null ? (
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {/* {profile !== null && profile.data.is_renter ? (
        <Fragment> */}
      <h3 className="table-head">Tenant Portal</h3>
      <SearchTenants className="table-head" data={tenantsData} />
    </Fragment>
  );
  //   : (
  //     <Fragment>
  //       <p></p>
  //     </Fragment>
  //   )}
  // </Fragment>
  // );
};

// Dashboard.propTypes = {
//   getCurrentProfile: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   profile: PropTypes.object.isRequired,
// };

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
