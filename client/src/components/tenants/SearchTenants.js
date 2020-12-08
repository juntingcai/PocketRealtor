import React, { useState, useEffect, Fragment } from "react";

import TenantDataTable from "./TenantDataTable";
import '../../TenantTable.css';

const SearchTenants = (props) => {

  const [query, setQuery] = useState("");
  const [columns, setColumns] = useState(["firstname", "lastname"])
  const search = (rows) => {
    return props.data && rows.filter((row) =>
      columns.some(
        (column) =>
          row[column].toString().toLowerCase().indexOf(query.toLowerCase()) > -1
      )
    )
  };

  return (
    <Fragment>
      <div style={{marginLeft: "1%"}}>
        <input
          type="text"
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      <TenantDataTable data={search(props.data)} />
    </Fragment>
  );
};

export default SearchTenants;

