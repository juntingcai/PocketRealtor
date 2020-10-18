import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";

import ListingsTable from "../listings/ListingsTable";
const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  console.log(`profile = `);
  console.log(profile);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="my-1">
        Welcome to Pocket Realtor, {profile ? profile.data.firstname : ""}!
      </h1>

      {profile !== null ? (
        <Fragment>
          <br />
          <br />
          <h3>Profile Information</h3>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not created a profile yet. Tell us about yourself</p>
          <Link to="/createprofile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
      {profile !== null && profile.data.is_host ? (
        <Fragment>
          <h3>Listings</h3>
          <Link to="/createlisting" className="btn btn-success my-1">
            New Listing
          </Link>
          <ListingsTable listings={profile.data.listings} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You are not a host</p>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
