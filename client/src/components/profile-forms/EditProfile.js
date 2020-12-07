import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import faker from "faker";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PlaceInput from '../PlaceAutoComplete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useAlert } from '../../context/AlertProvider';
import Loading from '../../utils/Loading';

import Select from '@material-ui/core/Select';
import '../../css/ProfileForm.css'
import Axios from "axios";
import { getUserProfile, getUserPreference, getUserRole, updateUserProfile, updateUserRole } from "../../utils/functions";
import Property from "../Property";

// avatar: "https://res.cloudinary.com/dyegmklny/image/upload/v1606765327/pr/cpo5kmcdftk7rjiagekj.png"
// birthday: null
// email: "jvfox@usfca.edu"
// firstname: "John"
// gender: 2
// id: 50012
// intro: "This is JT hahah something more"
// lastname: "Fox"
// nickname: "user50012"
// occupation: null


const EditProfile = ({ userid }) => {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [preference, setPreference] = useState(null);


  const {
    firstname,
    lastname,
    birthday,
    nickname,
    intro,
    gender,
    occupation,
    avatar,
  } = profile;
  
  const {
    isRenter,
    isHost,
    isAgent
  } = role;

  const [file, setFile] = useState(null);


  const [placeValue, setPlaceValue] = useState("");

  const [zipcode, setZipcode] = useState("");

  const [editing, setEditing] = useState(false);

  const { setAlert } = useAlert();

  useEffect(() => {
    if (!userid || userid === null) return;
    getUserProfile(userid).then(res => setProfile(res));
    getUserPreference(userid).then(res => setPreference(res));
    getUserRole(userid).then(res => setRole(res));
    // if (props.userid) {
    //   props.getCurrentProfile(props.userid)
    //   //Get user preferences
    //   Axios.get("http://52.53.200.228:3080/tenant/preference/" + props.userid)
    //     .then(res => {
    //       console.log(res.data.preferedZips, res.data.preferredCities)
    //       if (res.data)
    //         setPreference({
    //           zips: res.data.preferedZips,
    //           cities: res.data.preferredCities,
    //         })
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   //Get user roles
    //   Axios.get("http://52.53.200.228:3080/user/role/" + props.userid)
    //     .then(res => {
    //       if (res.data) {
    //         setRole({
    //           ...res.data,
    //         })
    //       }

    //     }).catch(err => {
    //       console.log(err)
    //     })
    // }

    // // const data = props.profile.profile.data;
    // if (!props.profile.loading) {
    //   console.log(props.profile)
    //   var data = props.profile.profile.data;
    //   setFormData({
    //     firstname: data.firstname,
    //     lastname: data.lastname,
    //     role: data.role,
    //     birthday: (data.birthday === null) ? "" : data.birthday,
    //     nickname: (data.nickname === null) ? "user" + props.userid : data.nickname,
    //     intro: data.intro === null ? "" : data.intro,
    //     gender: (data.gender === null) ? 0 : data.gender,
    //     occupation: data.occupation === null ? "" : data.occupation,
    //     avatar: data.avatar === null ? faker.image.avatar() : data.avatar,
    //     preferredCity: data.preferredCity,
    //   });
    // }
  }, [userid]);


  const handleCheckRole = (event) => {
    setRole({ ...role, [event.target.name]: event.target.checked });
  };



  const roleError = isAgent && (isRenter || isHost)

  const onChange = (e) => {

    setProfile({ ...profile, [e.target.id]: e.target.value });

  };

  const nameTag = (name, index) => {
    return (

      <div className="name-tag" key={index}>
        <div className="name">
          {name}
        </div>

        <ClearRoundedIcon className="delete-btn" onClick={deleteTag(index)} />

      </div>

    )
  }

  const deleteTag = () => {

  }

  const onSubmit = (e) => {
    e.preventDefault();
    
    updateUserProfile(profile)
    .then(() => updateUserRole(role))
    .then(() => setAlert("Profile Saved", 2))
    console.log("successly submitted");
    
  };

  const onFileChange = (e) => {
    setFile({ file: e.target.files[0] });
    console.log("added file");
    console.log(e.target.files[0]);
  };


  const addZipcode = () => {
    if (zipcode.length != 5)
      alert("invalid zipcode");
    else {
      Axios.put("http://52.53.200.228:3080/tenant/preference/" + zipcode)
        .then(res => {
          if (res.data.code === 10000) {
            setPreference({
              ...preference,
              zips: [...preference.zips, zipcode]
            })
            setAlert(2, "Preferred Zipcode added");
          }
          else {
            setAlert(0, res.data.msg);
          }
        }).catch(err => {
          console.log(err);
        })
    }
  }

  const handleSelectOcp = e => {
    setProfile({
      ...profile,
      occupation: e.target.value
    })
  }

  const addCity = () => {
    const addr = placeValue.split(",");
    if (placeValue.length === "")
      alert("invalid city");
    else {
      Axios.put("http://52.53.200.228:3080/tenant/preference/",
        {
          city: addr[0],
          state: addr[1],
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
    }
  }

  return (
    <Fragment>
      <div className="profile-form-wrap">
        {profile === null ? <Loading /> :
          <>
            <div className="avatar-uploader">
              <Avatar alt={firstname} src={avatar} />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="contained-button-file"
                multiple
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  color="primary"

                  startIcon={<CloudUploadIcon />}
                >
                  Upload
            </Button>
              </label>

            </div>

            <form className="profile-form" onSubmit={(e) => onSubmit(e)}>
              <div className="form-head">
                <h1 className="profile-form-title">Edit Profile</h1>
                <Button variant="outlined" size="large" color="primary" className="edit-btn" onClick={() => setEditing(!editing)}>
                  {editing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <TextField
                id="firstname"
                label="First name"
                fullWidth
                value={firstname}
                InputProps={{
                  readOnly: !editing,
                }}
                onChange={(e) => onChange(e)}
                variant="outlined"
              />
              <TextField
                id="lastname"
                label="Last name"
                fullWidth
                value={lastname}
                InputProps={{
                  readOnly: !editing,
                }}
                onChange={(e) => onChange(e)}
                variant="outlined"
              />

              {/* <div className="form-group">
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
        </div> */}
              <TextField
                id="nickname"
                label="nickname"
                fullWidth
                value={nickname}
                InputProps={{
                  readOnly: !editing,
                }}
                onChange={(e) => onChange(e)}
                variant="outlined"
              />
              <FormControl variant="outlined" className="gender-selector">
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  value={gender}
                  onChange={(e) => onChange(e)}
                  label="Gender"

                >
                  <MenuItem value={0} disabled>
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem id="gender" value={1}>Male</MenuItem>
                  <MenuItem id="gender" value={2}>Female</MenuItem>
                  <MenuItem id="gender" value={3}>Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                className="bd-selector"
                id="birthday"
                label="Birthday"
                type="datetime-local"
                value={birthday}
                onChange={(e) => onChange(e)}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="intro"
                label="Introduction"
                fullWidth
                multiline
                rows={5}
                value={intro}
                onChange={(e) => onChange(e)}
                variant="outlined"
                placeholder="Introduce yourself :)"
              />


              <FormControl variant="outlined" className="occupation-selector" fullWidth>
                <InputLabel id="occupation">occupation</InputLabel>
                <Select
                  labelId="occupation"
                  id="occupation"
                  value={occupation}
                  onChange={handleSelectOcp}
                  label="Occupation"

                >
                  <MenuItem value="" disabled>
                    <em>Occupation</em>
                  </MenuItem>
                  <MenuItem value={"Software Developer"}>Software Developer</MenuItem>
                  <MenuItem value={"Student"}>Student</MenuItem>
                  <MenuItem value={"Realtor"}>Realtor</MenuItem>
                  <MenuItem value={"Freelance"}>Freelance</MenuItem>
                  <MenuItem value={"Teacher"}>Teacher</MenuItem>
                  <MenuItem value={"Farmer"}>Farmer</MenuItem>
                  <MenuItem value={"Technician"}>Technician</MenuItem>
                  <MenuItem value={"Construction"}>Construction</MenuItem>
                  <MenuItem value={"Nurse"}>Nurse</MenuItem>
                  <MenuItem value={"Engineer"}>Engineer</MenuItem>
                  <MenuItem value={"Physician"}>Physician</MenuItem>
                  <MenuItem value={"Sales"}>Sales</MenuItem>
                  <MenuItem value={"Artist"}>Artist</MenuItem>
                  <MenuItem value={"Lawyer"}>Lawyer</MenuItem>
                  <MenuItem value={"Architect"}>Architect</MenuItem>
                  <MenuItem value={"Public Servant"}>Public Servant</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>

                </Select>
              </FormControl>



              <FormControl required error={roleError} component="fieldset" className="role-selector">
                <FormLabel component="legend">Select User Roles</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={isRenter} onChange={handleCheckRole} name="isRenter" />}
                    label="Tenant"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isHost} onChange={handleCheckRole} name="isHost" />}
                    label="Host"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isAgent} onChange={handleCheckRole} name="isAgent" />}
                    label="Agent"
                  />
                </FormGroup>
                {roleError && <FormHelperText>Can not select agent while host or tenant is selected</FormHelperText>}
              </FormControl>
              <div className="submit-button">

                {editing && <Button className="confirm-btn" variant="contained" color="primary" onClick={onSubmit}>
                  Submit
              </Button>}
              </div>
              {isRenter && <div className="preference">
                <div className="prefer-head">
                  <div className="name-tag-title">
                    {"Preferred Cities: "}
                  </div>

                  {preference.cities.map((item, index) => (

                    nameTag(item, index)
                  ))}

                </div>
                <div className="place-container">
                  <PlaceInput value={placeValue} setValue={setPlaceValue} />
                  <Button color="primary" onClick={addCity}>ADD</Button>
                </div>
                <div className="prefer-head">
                  <div className="name-tag-title">
                    {"Preferred ZIP Code: "}
                  </div>

                  {preference.zips.map((item, index) => (
                    nameTag(item, index)
                  ))}

                </div>
                <div className="place-container">
                  <input className="zipcode-box" type="number" minLength={5} maxLength={6} placeholder={"Enter ZIP Code"} value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                  <Button color="primary" onClick={addZipcode}>ADD</Button>
                </div>
              </div>}
              {/* <TextField
          id="zipcode"
          label="ZIP Code"
          type="number"
          fullWidth
          
          onChange={setZipcode}
          variant="outlined"
          endAdornment={
            <InputAdornment position="end">
              <Button color="primary">ADD</Button>
            </InputAdornment>
          }
        />
        <FormControl  variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">ZIP Code</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type="number"
            value={zipcode}
            onChange={setZipcode}
            endAdornment={
              <InputAdornment position="end">
                <Button color="primary">ADD</Button>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl> */}



            </form>
          </>}
      </div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  userid: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  userid: state.auth.id,
});

export default withRouter(connect(mapStateToProps)(EditProfile));
