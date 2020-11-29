import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Login from './Login';
import Register from './Register';
import { connect } from "react-redux";
import { closeDialog, toLogin, toRegister } from '../../actions/dialog';
import PropTypes from "prop-types";


const AuthDialog = (props) => {
  
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  const handleClose = () => {
    setOpen(false);
    props.closeDialog()

  };
  return (
    <div>
      
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'body'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers>
          {
              
               (props.action === 'login')? <Login/> : <Register/>
          }
        </DialogContent>
        
      </Dialog>
    </div>
  );
}


AuthDialog.propTypes = {
  toLogin: PropTypes.func.isRequired,
  toRegister: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool,
  action: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.dialog.open,
  action: state.dialog.action,

});


export default connect(mapStateToProps, {closeDialog, toLogin, toRegister})(AuthDialog);