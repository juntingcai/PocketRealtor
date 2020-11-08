import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import TenantDataTable from "./TenantDataTable";
import '../../TenantTable.css';
const SearchTenants = (props) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  console.log(props);
  const search = (rows) => {
    const columns = ["firstname", "lastname", "occupation"];
    return rows.filter((row) =>
      columns.some(
        (column) =>
          row[column].toString().toLowerCase().indexOf(query.toLowerCase()) > -1
      )
    );
  };
  return (
    <Fragment>
      <div class="table-head">
        <input
          type="text"
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      {/* <TenantDataTable data={search(props.data)} /> */}
      <TenantDataTable data={search(props.data)} />
    </Fragment>
  );
};

export default SearchTenants;
