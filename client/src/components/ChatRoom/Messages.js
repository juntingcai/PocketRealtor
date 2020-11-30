import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ConversationsPane from './ConversationsPane';
import ChatPane from './ChatPane';
import DetailPane from './DetailPane';
import Loading from '../../utils/Loading'
import '../../css/Messages.css';
//import DetailPane from './DetailPane';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})
const img = require('../../static/avatar.png');

const img_2 = "https://i.imgur.com/0avxl7q.jpg";
//role: 1 tenant, 2 host, 



const Messages = ({history, user}) => {

    useEffect(() => {
        if(!user.loading && !user.isAuthenticated)
            history.replace('/');
    })

    return (
        <Fragment>
            <div id="message">
                {!user.loading && <div className="message-wrap">
                    <ConversationsPane  />
                    <ChatPane user={user} />
                    <DetailPane userid={user.id} />
                </div>}
            </div>
        </Fragment>
    );
}

Messages.propTypes = {

    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth,
});
export default connect(mapStateToProps)(Messages)