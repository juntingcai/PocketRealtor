import React, { Fragment } from "react";
import faker from "faker";
import '../../TenantTable.css';

const TenantDataTable = (props) => {
  // console.log("data:");
  // console.log(props.data);
  // console.log("succcess");

  return (
    <Fragment>
      <p className="table-head">Displaying {props.data.length} Results</p>
      <table className="tenant-table" cellPadding={0} cellSpacing={0}>
        <thead>
          <th>Photo</th>
          <th>First Name</th>
          <th>Last Name</th>
          {/* <th>Preferred City</th> */}
          <th>Occupation</th>
        </thead>
        <tbody>
          {props.data.map((element) => (
            <tr key={element.firstname + element.lastname}>
              <td>
                <img
                  alt="avatar"
                  style={{ maxWidth: "40px" }}
                  src={element.avatar}
                />
              </td>
              <td>{element.firstname}</td>
              <td>{element.lastname}</td>
              {/* <td>{element.preferredCity}</td> */}
              <td>{element.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default TenantDataTable;
