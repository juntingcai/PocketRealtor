import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { updateProfile, getCurrentProfile } from "../../actions/profile";

const EditProfile = ({
  profile: { profile, loading },
  updateProfile,
  getCurrentProfile,
  history,
}) => {
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

  const [isCheckedHost, setIsCheckedHost] = useState(is_host);
  const [isCheckedRenter, setIsCheckedRenter] = useState(is_host);
  const [isCheckedAgent, setIsCheckedAgent] = useState(is_host);

  const onChange = (e) => {
    if (e.target.name === "is_host") {
      setFormData({
        ...formData,
        is_host: e.currentTarget.checked,
      });
    } else if (e.target.name === "is_renter") {
      setFormData({
        ...formData,
        is_renter: e.currentTarget.checked,
      });
    } else if (e.target.name === "is_agent") {
      setFormData({
        ...formData,
        is_agent: e.currentTarget.checked,
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <Fragment>
      {" "}
      <h1 className="medium text-primary">Edit Profile</h1>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <p>First Name:</p>
          <input
            type="text"
            placeholder="First name"
            name="firstname"
            value={firstname}
            readOnly
          />
        </div>
        <div className="form-group">
          <p>Last Name:</p>
          <input
            type="text"
            placeholder="Last name"
            name="lastname"
            value={lastname}
            readOnly
          />
        </div>
        <div className="form-group">
          <p>Birthday:</p>
          <input
            type="text"
            placeholder="Birthday"
            name="birthday"
            value={birthday}
            onChange={(e) => onChange(e)}
          />
        </div>
        <p>Username:</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="nickname"
            value={nickname}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>Biographical Information:</p>
          <textarea
            placeholder="A short intro of yourself"
            name="intro"
            value={intro}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <div className="form-group">
          <br />
          <br />
          <p>Your User Roles</p>
          <input
            type="checkbox"
            onChange={(e) => {
              setIsCheckedHost(e.currentTarget.checked);
              onChange(e);
            }}
            checked={is_host}
            name="is_host"
            value={is_host}
          />
          <label htmlFor="is_host"> Host</label>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            onChange={(e) => {
              setIsCheckedRenter(e.currentTarget.checked);
              onChange(e);
            }}
            checked={is_renter}
            name="is_renter"
            value={is_renter}
          />
          <label htmlFor="is_renter"> Renter</label>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            onChange={(e) => {
              setIsCheckedAgent(e.currentTarget.checked);
              onChange(e);
            }}
            checked={is_agent}
            name="is_agent"
            value={is_agent}
          />
          <label htmlFor="is_agent"> Agent</label>
        </div>

        <input type="submit" className="btn btn-light my-1" />
        <a className="btn btn-light my-1" href="/dashboard">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
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
})(withRouter(EditProfile));
