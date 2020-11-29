import React, { Fragment, useState, useEffect } from "react";
import axios from "axios"
import {URL} from "../../utils/constants"
import faker from "faker";
import '../../TenantTable.css';
import setAuthToken from "../../utils/setAuthToken";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const TenantDataTable = (props) => {
  const classes = useStyles();
  console.log("TenantDataTable props")
  console.log(props)
  const [groups, setGroups] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userid, setUserid] = useState(null)
  
  const [groupData, setGroupData] = useState(null)
  
  const verifyUser = async () => {
    
    try {
      
      const response = await axios.post(`${URL}/user/verifyuser`);
      console.log(`RESPONSE TO /user/verifyuser is `)
      console.log(response)
      setUserid(response.data.id)

      if (response.data.msg === "Invalid token") {
        console.log("auth_error")
      } else {
       console.log("user_loaded")
      }
    } catch (error) {
      console.log("error")
    }
  }


  const getGroups = async () => {
      try {
        const response = await axios.get(`${URL}/tenant/groups`);
        const groups = response.data;
        console.log("Groups:");
        console.log(groups);
        setGroups(groups);
      } catch (error) {
        console.log(error.message);
      }
    };

  const inviteTenant = async (groupId, email) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const payload = {};
      payload.groupId = groupId;
      payload.email = email;
      const body = payload;
      const response = await axios.post(
        `${URL}/tenant/group/invite/`,
        body,
        config
      );
      
      console.log("Group Invite Response:");
      console.log(response)
      

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setLoading(true)
    verifyUser()
    setLoading(false)
}, [loading])
console.log("verifyuser = ")
console.log(userid)

  useEffect(() => {
      setLoading(true)
      getGroups()
      setLoading(false)
  }, [loading])

  console.log("Groups in Search")
  console.log(groups)

  const getGroupData = async (id) => {
    try {
      const response = await axios.get(`${URL}/tenant/group/${id}`);
      
      console.log("Get group response:");
      console.log(response);
      setGroupData(response.data);
      console.log("success")
    } catch (error) {
      console.log(error.message);
    }
  };



useEffect(() => {
    setLoading(true)
    if (groups && groups[0] && groups[0].id) {
        
        console.log("groups[0].id")
        console.log(groups[0].id)
        getGroupData(groups[0].id)
    }
   
    setLoading(false)
}, [groups])

console.log("groupdata")
console.log(groupData)


  const onButtonClick = (email) => {
    console.log(email)
    console.log("group id = ")
    console.log(groups[0].id)
    inviteTenant(groups[0].id, email)
    console.log("invitation sent")
  }
  return (
    <Fragment>
      <p style={{marginLeft: "1%"}}>Displaying {props.data.length} Results</p>
      <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Email Address</TableCell>
                  {groupData && groupData.owner && groupData.owner.id === userid? (<TableCell><Button color="primary">Contact</Button></TableCell>): null}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data.map((element) => (
                  <TableRow key={element.firstname + element.lastname}>
                    <TableCell><img
                  alt="avatar"
                  style={{ maxWidth: "55px" }}
                  src={element.avatar}
                /></TableCell>
                    <TableCell>{element.firstname}</TableCell>
                    <TableCell>{element.lastname}</TableCell>
                    <TableCell>{element.occupation}</TableCell>
                <TableCell>{element.email}</TableCell>
                {groupData && groupData.owner && groupData.owner.id === userid ? (<TableCell><Button onClick={() => onButtonClick(element.email)} variant="contained" color="primary">Contact</Button></TableCell>): null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
    </Fragment>
  );
};

export default TenantDataTable;
