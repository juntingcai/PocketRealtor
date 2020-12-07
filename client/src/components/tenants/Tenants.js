import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Loading from "../../utils/Loading";
import '../../TenantTable.css';
import {URL} from "../../utils/constants"


import Axios from "axios";
import SearchTenants from "./SearchTenants";

const Tenants = (
  {
  }
) => {
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTenants = async () => {
    try {
        console.log(URL)
      const response = await Axios.get("http://52.53.200.228:3080/tenants");
      const tenants = response;
      console.log("**** 888")
      console.log(tenants);
      setTenantsData(tenants.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log("tenants")
  console.log(tenantsData)


  useEffect(() => {
    setLoading(true);
    getTenants();
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      {/* <h3 className="table-head">Tenant Portal</h3> */}
      {tenantsData.length > 0 ? <SearchTenants className="table-head" data={tenantsData} /> : null}
      
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps)(Tenants);
