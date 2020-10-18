import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getCurrentProfile } from "../../actions/profile";

const MyProfile = ({ profile: { profile, loading }, getCurrentProfile }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    nickname: "",
    intro: "",
    is_host: false,
    is_renter: false,
    is_agent: false,
  });

  const {
    firstname,
    lastname,
    birthday,
    nickname,
    intro,
    is_host,
    is_renter,
    is_agent,
  } = formData;

  useEffect(() => {
    getCurrentProfile();
    setFormData({
      firstname:
        loading || !profile.data.firstname ? "" : profile.data.firstname,
      lastname: loading || !profile.data.lastname ? "" : profile.data.lastname,
      birthday: loading || !profile.data.birthday ? "" : profile.data.birthday,
      nickname: loading || !profile.data.nickname ? "" : profile.data.nickname,
      intro: loading || !profile.data.intro ? "" : profile.data.intro,
      is_host: loading || !profile.data.is_host ? false : true,
      is_renter: loading || !profile.data.is_renter ? false : true,
      is_agent: loading || !profile.data.is_agent ? false : true,
    });
  }, [loading]);

  return (
    <Fragment>
      {" "}
      <h1 className="medium text-primary">Your Profile</h1>
      <form className="form">
        <div className="form-group">
          <p>First Name:</p>
          <input
            type="text"
            placeholder="First name"
            name="firstname"
            value={firstname}
          />
        </div>
        <div className="form-group">
          <p>Last Name:</p>
          <input
            type="text"
            placeholder="Last name"
            name="lastname"
            value={lastname}
          />
        </div>
        <div className="form-group">
          <p>Birthday:</p>
          <input
            type="text"
            placeholder="Birthday"
            name="birthday"
            value={birthday}
          />
        </div>
        <p>Username:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="nickname"
            value={nickname}
          />
        </div>
        <div className="form-group">
          <p>Biographical Information:</p>
          <textarea
            placeholder="A short intro of yourself"
            name="intro"
            value={intro}
          ></textarea>
        </div>
        <div className="form-group">
          <br />
          <br />
          <p>Your User Roles</p>
          <input
            type="checkbox"
            checked={is_host}
            name="is_host"
            value={is_host}
          />
          <label for="is_host"> Host</label>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            checked={is_renter}
            name="is_renter"
            value={is_renter}
          />
          <label for="is_renter"> Renter</label>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            checked={is_agent}
            name="is_agent"
            value={is_agent}
          />
          <label for="is_agent"> Agent</label>
        </div>

        <a className="btn btn-light my-1" href="/dashboard">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

MyProfile.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
})(withRouter(MyProfile));
