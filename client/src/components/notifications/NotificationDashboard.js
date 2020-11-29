import React, {Fragment, useEffect, useState} from "react"
import axios from "axios"
import {Button, Container, TextField} from "@material-ui/core"
import {URL} from "../../utils/constants"
import faker from "faker"

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const NotificationDashboard = () => {
    const classes = useStyles();

    const [invitees, setInvitees] = useState(null)
    const [groups, setGroups] = useState(null)
    const [applications, setApplications] = useState([])
    const [incomingApplications, setIncomingApplications] = useState(null)
    const [loading, setLoading] = useState(false)

    const [invitations, setInvitations] = useState([])


    const getIncomingApplications = async (groupId) => {
            try {
              const response = await axios.get(`${URL}/tenant/group/waiting/${groupId}`);
              
              console.log("Incoming applications response:");
              console.log(response);
              setIncomingApplications(response.data);
              console.log("Success!")
            } catch (error) {
              console.log(error.message);
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

      const getInvitees = async (id) => {
        try {
          const response = await axios.get(`${URL}/tenant/group/invite/${id}`);
          
          console.log("Invitees response:");
          console.log(response);
          setInvitees(response.data);
          console.log("success")
        } catch (error) {
          console.log(error.message);
        }
      };

      const getInvitations = async (id) => {
        try {
          const response = await axios.get(`${URL}/tenant/invitations`);
          
          console.log("Invitations response:");
          console.log(response);
          setInvitations(response.data);
          console.log("Success!")
        } catch (error) {
          console.log(error.message);
        }
      };

      const getApplications = async () => {
          try {
              const response = await axios.get(`${URL}/tenant/group/applied/list`)
              console.log("Applications to groups that you have applied to")
              setApplications(response.data)
              console.log("Success")
          } catch (error) {
              console.log(error.message)
          }
      }

  
    useEffect(() => {
        setLoading(true)
        getGroups()
        
        setLoading(false)
    }, [loading])
   

    useEffect(() => {
        setLoading(true)
        if (groups) {
            if (groups[0] && groups[0].id) {
                console.log("groups[0].id")
            console.log(groups[0].id)
            getInvitees(groups[0].id)
            }
            
        }
       
        setLoading(false)
    }, [groups])

    useEffect(() => {
        setLoading(true)
        if (groups) {
            if (groups[0] && groups[0].id) {
                console.log("groups[0].id")
            console.log(groups[0].id)
            getIncomingApplications(groups[0].id)
            }
        }
       
        setLoading(false)
    }, [groups])

    console.log("incoming applications")
    console.log(incomingApplications)

    console.log("Invitees in Notifications")
    console.log(invitees)

    // Applications to groups that you have applied
    useEffect(() => {
        setLoading(true)
        getApplications()
        setLoading(false)
    }, [])

    console.log("Applications: ")
    console.log(applications)

    // Invitations to groups
    useEffect(() => {
        setLoading(true)
        getInvitations()
        setLoading(false)
    }, [])    

    console.log("Invitations: ")
    console.log(invitations)

    const onButtonClickAcceptIncomingApplication = async (groupId, userApplicationId) => {
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const data = {
                groupId: groupId,
                applicantId: userApplicationId,
                approved: true
            }
            const res = await axios.put(
              `${URL}/tenant/group/apply/respond/`,
              data,
              config
            );
        

            console.log("accepting invitation = ")
            console.log(res)
      
            setIncomingApplications(incomingApplications.filter(incomingApplication => incomingApplication.applicantId !== userApplicationId))
            console.log("filtering out invitation")
              console.log(invitations)
          } catch (error) {
            console.log(error)
          }
    }
    const onButtonClickRejectIncomingApplication = async (groupId, userApplicationId) => {
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const data = {
                groupId: groupId,
                applicantId: userApplicationId,
                approved: false
            }
            const res = await axios.put(
              `${URL}/tenant/group/apply/respond/`,
              data,
              config
            );
        

            console.log("accepting invitation = ")
            console.log(res)
      
            setIncomingApplications(incomingApplications.filter(incomingApplication => incomingApplication.applicantId !== userApplicationId))
            console.log("filtering out invitation")
              console.log(invitations)
          } catch (error) {
            console.log(error)
          }
    }

    const onButtonClickAcceptInvitation = async (groupId) => {
            try {
              const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              const res = await axios.put(
                `${URL}/tenant/group/invite/accept/${groupId}`,
                config
              );
          

              console.log("accepting invitation = ")
              console.log(res)
        
              setInvitations(invitations.filter(invitation => invitation.groupId !== groupId))
              console.log("filtering out invitation")
                console.log(invitations)
            } catch (error) {
              console.log(error)
            }
    }

    const onButtonClickRejectInvitation = async (groupId) => {
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const res = await axios.put(
              `${URL}/tenant/group/invite/reject/${groupId}`,
              config
            );
        
            console.log("rejecting invitation = ")
            console.log(res)
                
            setInvitations(invitations.filter(invitation => invitation.groupId !== groupId))
            console.log("filtering out invitation")
            console.log(invitations)
          } catch (error) {
            console.log(error)
          }
    }

    const onButtonClickReject = async (e) => {}

return <Container>
    <h1>Notifications Dashboard</h1>
    {invitees ? (<Fragment>
        <h3>Your Pending Invites</h3>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
              <TableCell>Photo</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  {/* <TableCell><Button color="primary">Accept</Button></TableCell> */}
                  <TableCell><Button color="secondary">Cancel</Button></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitees.map((element) => (
                  <TableRow key={element.firstname + element.lastname}>
                    <TableCell><img
                  alt="avatar"
                  style={{ maxWidth: "55px" }}
                  src={faker.image.avatar()}
                /></TableCell>
                    <TableCell>{element.firstname}</TableCell>
                    <TableCell>{element.lastname}</TableCell>
                    {/* <TableCell><Button onClick={() => onButtonClickAccept(element.email)} variant="contained" color="primary">Accept</Button></TableCell> */}
                    <TableCell><Button onClick={() => onButtonClickReject(element.email)} variant="contained" color="secondary">Cancel</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer></Fragment>): null}
            {incomingApplications ? (<Fragment>
        <h3>Your Incoming Applications</h3>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
              <TableCell>Photo</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell><Button color="primary">Accept</Button></TableCell>
                  <TableCell><Button color="secondary">Reject</Button></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomingApplications && incomingApplications.map((element) => (
                  <TableRow key={element.firstname + element.lastname}>
                    <TableCell><img
                  alt="avatar"
                  style={{ maxWidth: "55px" }}
                  src={faker.image.avatar()}
                /></TableCell>
                    <TableCell>{element.firstname}</TableCell>
                    <TableCell>{element.lsstname}</TableCell>
                    {/* <TableCell><Button onClick={() => onButtonClickAccept(element.email)} variant="contained" color="primary">Accept</Button></TableCell> */}
                    <TableCell><Button onClick={() => onButtonClickAcceptIncomingApplication(groups[0].id, element.id)} variant="contained" color="primary">Accept</Button></TableCell>
                    <TableCell><Button onClick={() => onButtonClickRejectIncomingApplication(groups[0].id, element.id)} variant="contained" color="secondary">Reject</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer></Fragment>): null}
            {applications.length > 0 ? (<Fragment>
        <h3>Your Pending Applications</h3>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
              <TableCell>Photo</TableCell>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Description</TableCell>
                  {/* <TableCell><Button color="primary">Accept</Button></TableCell> */}
                  <TableCell><Button color="secondary">Cancel</Button></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell><img
                  alt="avatar"
                  style={{ maxWidth: "55px" }}
                  src={faker.image.avatar()}
                /></TableCell>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>{element.description}</TableCell>
                    {/* <TableCell><Button onClick={() => onButtonClickAccept(element.email)} variant="contained" color="primary">Accept</Button></TableCell> */}
                    <TableCell><Button onClick={() => onButtonClickReject(element.email)} variant="contained" color="secondary">Cancel</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer></Fragment>): null}

        <Fragment>
            {invitations.length > 0 ? (<Fragment><h3>Your Invitations</h3>
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
              <TableCell>Photo</TableCell>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell><Button color="primary">Accept</Button></TableCell>
                  <TableCell><Button color="secondary">Reject</Button></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitations.map((element) => (
                  <TableRow key={element.groupId}>
                    <TableCell><img
                  alt="avatar"
                  style={{ maxWidth: "55px" }}
                  src={faker.image.abstract()}
                /></TableCell>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>{element.description}</TableCell>
                    <TableCell><Button onClick={() => onButtonClickAcceptInvitation(element.groupId)} variant="contained" color="primary">Accept</Button></TableCell>
                    <TableCell><Button onClick={() => onButtonClickRejectInvitation(element.groupId)} variant="contained" color="secondary">Reject</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
            </Fragment>)
: null}
</Fragment>

</Container>
}

export default NotificationDashboard