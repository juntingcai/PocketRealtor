import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { InlineWidget, CalendlyEventListener } from "react-calendly"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const HostTimeslots = () => {
    const classes = useStyles();
 


  return (
    <Container>
    <InlineWidget url="https://calendly.com/jvfox/30min"/>

    {/* <CalendlyEventListener url="https://calendly.com/jvfox/30min" onEventScheduled={(e) => console.log(e)} /> */}
    </Container>
  );
}
export default HostTimeslots