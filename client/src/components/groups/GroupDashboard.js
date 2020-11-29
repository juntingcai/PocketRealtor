import React, { useState, useEffect, Fragment } from "react";
import {Button, Container, TextField} from "@material-ui/core"

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input"


import axios from "axios"
import {URL} from "../../utils/constants"

import faker from "faker"

import setAuthToken from "../../utils/setAuthToken";

import { InlineWidget, CalendlyEventListener } from "react-calendly";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: 148
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  card: {
      maxWidth: 150
  },
  table: {
    minWidth: 300,
  },
}));

const GroupDashboard = (props) => { 
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [event, setEvent] = useState({})
    // const group = {name: "SF Renters"}
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState(false)
    const [groupData, setGroupData] = useState(null)
    const [groupListings, setGroupListings] = useState(null)

    const [pocketRealtorGroups, setPocketRealtorGroups] = useState(null)
    const [note, setNote] = useState("")
    const [userId, setUserId] = useState(null)
    const verifyUser = async () => {

      const token = JSON.parse(localStorage.getItem('token'));
      setUserId(token.id);
    }
  
    useEffect(() => {
        setLoading(true)
        verifyUser()
        setLoading(false)
    }, [loading])
    console.log("verifyuser = ")
    console.log(userId)

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

      const getPocketRealtorGroups = async () => {
        try {
          const response = await axios.get(`${URL}/tenant/find/groups`);
          const groups = response.data;
          console.log("PR Groups:");
          console.log(groups);
          setPocketRealtorGroups(groups);
        } catch (error) {
          console.log(error.message);
        }
      };



    useEffect(() => {
        setLoading(true)
        getGroups()
        setLoading(false)
    }, [loading])

    useEffect(() => {
        setLoading(true)
        getPocketRealtorGroups()
        setLoading(false)
    }, [])

    console.log("pocketRealtorGroups: ")
    console.log(pocketRealtorGroups)

    const getGroup = async (id) => {
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
            getGroup(groups[0].id)
        }
       
        setLoading(false)
    }, [groups])

    

    const approvalTableCellGroupCreator = (element) => {
            if (groupData.owner.id === userId && element.isApproved) {
                return <Button disabled={true}>Approved</Button>
            } else if (groupData.owner.id === userId && !element.isApproved) {
                return <Button onClick={onButtonClickApproveListing(groupData.id, element.id)}>Approve</Button>
            }
            else if (groupListings.approvers.includes(groupData.owner.id)) {
                return <Button disabled={true}>Approved</Button>
            }
            else {
                return <Button disabled={true}>Approve</Button>
            }
    }

    const approvalTableCellGroupMember = (idOfUser, element) => {
            if (idOfUser === userId) {
                if (element.isApproved) {
                return <Button disabled={true}>Approved</Button>
                } else {
                    return <Button onClick={onButtonClickApproveListing(groupData.id, element.id)}>Approve</Button>
                }
            } 
            else if (groupListings.approvers.includes(idOfUser)) {
                return <Button disabled={true}>Approved</Button>
            }
            else {
                return <Button disabled={true}>Approve</Button>
            }
    }

    const getGroupListings = async (id) => {
        try {
          const response = await axios.get(`${URL}/tenant/group/view/listings/${id}`);
          
          console.log("Get group listings response:");
          console.log(response);
          setGroupListings(response.data);
          console.log("success")
          console.log(groupListings)
          console.log("done...")
        } catch (error) {
          console.log(error.message);
        }
      };

    useEffect(() => {
        setLoading(true)
        if (groups && groups[0] && groups[0].id) {
            
            console.log("groups[0].id")
            console.log(groups[0].id)
            getGroupListings(groups[0].id)
        }
       
        setLoading(false)
    }, [groups])

    console.log(groupListings)
    console.log("done...")

    
    console.log("groups")
    console.log(groups)
    console.log("get group data")
    console.log(groupData)


    const onButtonClickApply = async (groupId) => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const data = {}
          const res = await axios.post(
            `${URL}/tenant/group/apply/${groupId}`,
            data,
            config
          );
      

          console.log("accepting invitation = ")
          console.log(res)
    
        //   setInvitations(invitations.filter(invitation => invitation.groupId === groupId))
        //   console.log("filtering out invitation")
        //     console.log(invitations)
        } catch (error) {
          console.log(error)
        }
}

const onButtonClickApproveListing = async (groupId, listingId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
          groupId: groupId,
          listingId: listingId
      }
      const res = await axios.put(
        `${URL}/tenant/group/approve/listing`,
        data,
        config
      );
      console.log("approving listing = ")
      console.log(res)

    } catch (error) {
      console.log(error)
    }
}

const onButtonClickWithdrawListing = async (groupId, listingId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
          groupId: groupId,
          listingId: listingId
      }
      const res = await axios.delete(
        `${URL}/tenant/group/approve/listing`,
        data,
        config
      );
      console.log("withdrawing approval of listing = ")
      console.log(res)

    } catch (error) {
      console.log(error)
    }
}

const onChange = (e) => {
    console.log(e.target.value)
    setNote(e.target.value);
  };


const addNote = async (groupId) => {
    console.log("clicked")
    console.log(groupId)
    console.log(note)
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
          message: note
      }
      const res = await axios.put(
        `${URL}/tenant/group/notes/put/${groupId}`,
        data,
        config
      );
      console.log("Note sent. Response = ")
      console.log(res)

    } catch (error) {
      console.log(error)
    }

    setNote("")
}

    return <Fragment>
    {/* <Container> */}
    {groups && groupData ? 
(
<Fragment>
    <div className={classes.root}>
    <h2>{groupData.name} Group</h2>
    <h5>{groupData.description}</h5>
    <Grid container spacing={2}>
      </Grid>
    <br/>
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
              <br/><br/>
              <div style={{textAlign: "left"}}>
                  <h4>Users</h4>
                  <ul style={{"listStyleType": "none"}}>
    <li>
        <img src={groupData.owner.avatar ? groupData.owner.avatar: faker.image.avatar()}/>
        <h5>{`${groupData.owner.firstname} ${groupData.owner.lastname}`}</h5>
        </li> 
                {
                    groupData.members.map((member) => (<li><img src={member.avatar ? member.avatar : faker.image.avatar()}/><h5>{`${member.firstname} ${member.lastname}`}</h5></li>))
                    // groupData.members.map((member) => (<li><img src={faker.image.avatar()}/>{`${member.firstname} ${member.lastname}`}</li>))
                }
                    </ul>
                </div>
            </Paper>
        </Grid>
        {/* <Grid item xs ={6}> */}
        <Grid item xs={10}>
          <Paper className={classes.paper}>
              <h3>Property Spreadsheet</h3>
              <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
                  <TableCell>Property Link</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Description</TableCell>
                  {/* <TableCell>Found by</TableCell>
                  <TableCell>Move-in date?</TableCell> */}
              <TableCell>Approved by {`${groupData.owner.firstname} ${groupData.owner.lastname}`}?</TableCell>
              {
                    groupData.members.map((member) => (<TableCell>Approved by {`${member.firstname} ${member.lastname}`}?</TableCell>))
                    // groupData.members.map((member) => (<li><img src={faker.image.avatar()}/>{`${member.firstname} ${member.lastname}`}</li>))
                }
                <TableCell>Contacted?</TableCell>
                <TableCell>Reserve Timeslot</TableCell>
                  {/* <TableCell><Button color="primary">Accept</Button></TableCell>
                  <TableCell><Button color="secondary">Reject</Button></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupListings && groupData? groupListings.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell><a href={`/property/${element.id}`}>Link</a></TableCell>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>{element.description}</TableCell>
                    {/* <TableCell>{`TBD`}</TableCell>
                    <TableCell>{`TBD`}</TableCell> */}
                <TableCell>{groupData.owner.id === userId && element.isApproved? (<Button disabled={true}>Approved</Button>): (<Button onClick={onButtonClickApproveListing(groupData.id, element.id)}>Approve</Button>)}</TableCell>
                {/* <TableCell>{approvalTableCellGroupCreator(element)}</TableCell> */}
                {

                // groupData.members.map((member) => (<TableCell>{approvalTableCellGroupMember(member.id, element)}</TableCell>))
                    groupData.members.map((member) => (<TableCell>{member.id === userId && element.isApproved? (<Button disabled={true}>Approved</Button>): (<Button disabled={true}>Approve</Button>)}</TableCell>))
                   
                }
                    <TableCell><Button>Contact</Button></TableCell>
                    {/* <TableCell><Button onClick={() => onButtonClickAcceptInvitation(element.groupId)} variant="contained" color="primary">Accept</Button></TableCell>
                    <TableCell><Button onClick={() => onButtonClickRejectInvitation(element.groupId)} variant="contained" color="secondary">Reject</Button></TableCell> */}
                    <TableCell><Button href={`/timeslots?id=${element.id}`}>View</Button></TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
            </TableContainer>
              {/* <div style={{textAlign: "left"}}>
              </div> */}
              
              </Paper>
              <Paper className={classes.paper}>
                  <h3>Notes</h3>
                  <TextField
          id="standard-full-width"
          label="Keep track of important information about your listings here"
          style={{ margin: 8 }}
          placeholder="Add a note..."
          fullWidth
          margin="normal"
          value={note}
          onChange={(e) => onChange(e)}
          InputLabelProps={{
            shrink: true,
          }}
        />
                  <Button variant="contained" onClick={() => addNote(groupData.id, note)} color="primary">Add Note</Button>
            <br/>
          {groupData && groupData.notes.length > 0 ? ( <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
              <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupData.notes.length > 0 ? groupData.notes.map((element) => (
                  <TableRow key={`${element.data}-${element.time}`}>
                    <TableCell>{`${element.user.firstname} ${element.user.last_name}: `}</TableCell>
                    <TableCell>{element.message}</TableCell>
                    <TableCell>{element.date}</TableCell>
                    <TableCell>{element.time}</TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
            </TableContainer>): null}
             

              </Paper>
        </Grid>
      </Grid>
    </div>
    </Fragment>
    )
    : 
    (
        <Fragment>
        <h2>Create a Group</h2>
        <Button href="/creategroup" variant="contained" color="primary">Create a Group</Button>
        <br/><br/>
        <h2>Join a Group</h2>
        
    {pocketRealtorGroups ?
     (pocketRealtorGroups.map((pocketRealtorGroup) => (<Card className={classes.card}>
        <CardContent>
          <img style={{ "maxWidth": "85%"}}src={faker.image.abstract()}/>
          <Typography variant="h5" component="h2">
            {pocketRealtorGroup.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
           {pocketRealtorGroup.description}
          </Typography>
        </CardContent>
        <CardActions>
        <Button size="tiny" variant="contained" onClick={() => onButtonClickApply(pocketRealtorGroup.id)} color="primary">Apply</Button>
        </CardActions>
      </Card>))): null}
        </Fragment>
    )
        }
    </Fragment>
    }

export default GroupDashboard
