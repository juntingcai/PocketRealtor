// import React, { useState, useEffect, Fragment } from "react";
// // import PropTypes from "prop-types";
// // import { connect } from "react-redux";
// // import { Link, withRouter, Redirect } from "react-router-dom";
// // import { updateProfile, getCurrentProfile } from "../../actions/profile";
// import axios from "axios";
// import {URL} from "../../utils/constants"
// import Container from "@material-ui/core/Container";



// const CreateGroup = (
// //     {
// //   profile: { profile, loading },
// //   getCurrentProfile,
// // }
// ) => {

// //   console.log(profile);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//   });

//   const {
//     name,
//     description,
//   } = formData;

// //   useEffect(() => {
// //     if (!profile) getCurrentProfile();
// //   }, [loading, getCurrentProfile, profile]);

//   const createGroup = async () => {
//     // const url = `${URL}/tenant/group/create`;
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const payload = {};
//     payload.name = name;
//     payload.description = description;

//     const body = payload;
//     try {
//       const response = await axios.post(
//         `${URL}/tenant/group/create`,
//         body,
//         config
//       );
//       console.log("create group response");
//       console.log(response);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     createGroup()
//     console.log("successfuly created a group")
//   };


//   return (
//     <Fragment>
//       {" "}
//       <Container>
//         <h1 className="medium text-primary">Create Group</h1>
//         <form className="form" onSubmit={(e) => onSubmit(e)}>
//           <div className="form-group">
//             <p>Group Name:</p>
//             <input
//               type="text"
//               placeholder="Name"
//               name="name"
//               value={name}
//               onChange={(e) => onChange(e)}
//             />
//             <div className="form-group">
//             <p>Description:</p>
//             <textarea
//               placeholder="Describe your group"
//               name="description"
//               value={description}
//               onChange={(e) => onChange(e)}
//             ></textarea>
//           </div>
//           </div>
//           <br />
//           <br />
//           <br />
//           <br />

//           <input type="submit" className="btn btn-success my-1" />

//           <a className="btn btn-light my-1" href="/mygroup">
//             Go Back
//           </a>
//         </form>
//       </Container>
//     </Fragment>
//   );
// };

// // CreateGroup.propTypes = {
// //   updateProfile: PropTypes.func.isRequired,
// //   getCurrentProfile: PropTypes.func.isRequired,
// //   profile: PropTypes.object.isRequired,
// // };

// // const mapStateToProps = (state) => ({
// //   profile: state.profile,
// // });

// // export default connect(mapStateToProps, {
// //   updateProfile,
// //   getCurrentProfile,
// // })(withRouter(CreateGroup));

// export default CreateGroup;

import React, { useState, useEffect, Fragment } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { Link, withRouter, Redirect } from "react-router-dom";
// import { updateProfile, getCurrentProfile } from "../../actions/profile";
import axios from "axios";
import {URL} from "../../utils/constants"
import Container from "@material-ui/core/Container";

import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const CreateGroup = (
//     {
//   profile: { profile, loading },
//   getCurrentProfile,
// }
) => {

//   console.log(profile);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const {
    name,
    description,
  } = formData;

//   useEffect(() => {
//     if (!profile) getCurrentProfile();
//   }, [loading, getCurrentProfile, profile]);

  const createGroup = async () => {
    // const url = `${URL}/tenant/group/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const payload = {};
    payload.name = name;
    payload.description = description;

    const body = payload;
    try {
      const response = await axios.post(
        `${URL}/tenant/group/create`,
        body,
        config
      );
      console.log("create group response");
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
    createGroup()
    console.log("successfuly created a group")
  };


  return (
    <Fragment>
      {" "}
      <Container>
        <h1 className="medium text-primary">Create Group</h1>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <p>Group Name:</p>
            <Input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
            />
            <div className="form-group">
            <p>Description:</p>
            <TextField
              placeholder="Describe your group"
              name="description"
              style = {{width: 400}}
              value={description}
              onChange={(e) => onChange(e)}
            ></TextField>
          </div>
          </div>
          <br />
          <br />

          <footer>
          <Input type="submit" className="btn btn-success my-1" />
          {/* <br /> */}
          {/* <a className="btn btn-light my-1" href="/mygroup">
            Go Back
          </a> */}
          {/* <br/> */}
          
          <Button  href="/mygroup">Back</Button>
          </footer>
        </form>
      </Container>
    </Fragment>
  );
};

// CreateGroup.propTypes = {
//   updateProfile: PropTypes.func.isRequired,
//   getCurrentProfile: PropTypes.func.isRequired,
//   profile: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   profile: state.profile,
// });

// export default connect(mapStateToProps, {
//   updateProfile,
//   getCurrentProfile,
// })(withRouter(CreateGroup));

export default CreateGroup;
