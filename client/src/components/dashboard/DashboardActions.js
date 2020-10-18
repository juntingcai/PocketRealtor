import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="form-group">
      <Link to="/myprofile" className="btn btn-light my-1">
        View Profile
      </Link>
      <Link to="/updateprofile" className="btn btn-light my-1">
        Edit Profile
      </Link>
    </div>
  );
};

export default DashboardActions;
