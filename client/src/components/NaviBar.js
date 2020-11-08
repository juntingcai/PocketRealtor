import React, { Fragment, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Popover from '@material-ui/core/Popover';
import { Link } from "react-router-dom";
import './../css/NaviBar.css';
import { connect } from "react-redux";
import { toLogin, toRegister } from '../actions/dialog';
import { logout } from '../actions/auth';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';


const NaviBar = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const authRoute = (e) => {
        if(!props.isAuthenticated){
            props.toLogin()
        }
        else{
            console.log(e.target.id)
            props.history.push("/" + e.target.id);
        }
    };
    const goto = (e) => {
      props.history.push("/" + e.target.id);
    }
    const open = Boolean(anchorEl);
    return (
        <Fragment>
            <div className="navi-wrap">
                <Link to="/" className="logo">Pocket Realtor</Link>
                <div className="button-group">
                    <div id="sell" onClick={authRoute} className="link theme">Sell Property</div>
                    <div id="findtenants" onClick={authRoute} className="link theme">Find Tenants</div>
                    <div className="menu-button-wrap" onClick={handleClick}>
                        <MenuIcon fontSize="large" style={{ color: '#1634d8', marginRight: '0.5rem' }} />
                        <Avatar alt="" src={props.avatar} />
                    </div>
                    <Popover
                        id="menu-button-popover"
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <div className="pull-menu" onClick={handleClose}>
                            {
                                !props.isAuthenticated && <div className="link-group">
                                    <div className="signin" onClick={props.toLogin}>Sign In</div>
                                    <div onClick={props.toRegister}>Sign Up</div>
                                </div>
                            }


                            {
                                props.isAuthenticated && <div className="link-group auth-link-group">
                                    <div id="myprofile" onClick={goto}>Profile </div>
                                    <div onClick={goto}>Notifications</div>
                                    <div onClick={goto}>Messages</div>
                                    <div id="savedlist" onClick={goto}>My list</div>
                                    <div onClick={goto}>My group</div>

                                </div>
                            }
                            <div className="link-group link-group-divider">
                                <div onClick={goto}>Sell property </div>
                                <div onClick={goto}>Find tenants</div>
                                <div >Contact us</div>
                            </div>

                            {props.isAuthenticated && <div className="link-group link-group-divider">
                                <div onClick={props.logout}>Sign Out</div>
                            </div>}


                        </div>
                    </Popover>


                </div>
            </div>
        </Fragment>
    )
}

NaviBar.propTypes = {
    toLogin: PropTypes.func.isRequired,
    toRegister: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    avatar: PropTypes.string,
};
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    avatar: (state.auth.user) ? state.auth.user.avatar : ""
});


export default withRouter(connect(mapStateToProps, { toLogin, toRegister, logout })(NaviBar));
