import React, { useContext, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const AlertContext = React.createContext();

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const alertType = ['error', 'warning', 'success'];

export function useAlert() {
    return useContext(AlertContext);
}

export function AlertProvider({children}) {

    const classes = useStyles();
    
    const [alertState, setAlertState] = useState({
        open: false,
        severity: alertType[0],
        msg: "",
    })

    const {
        open,
        severity,
        msg,
     } = alertState;

    function setAlert(type, msg){
        
        setAlertState({
            open: true,
            severity: alertType[type],
            msg: msg,
        })
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({
            open: false,
            severity: "error",
            msg: ""
        })
    };

    return (
        <AlertContext.Provider value={{setAlert}}>
            {children}
            <div className={classes.root}>
                
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
        </AlertContext.Provider>
    )
}