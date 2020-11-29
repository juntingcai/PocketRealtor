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

const test_messages = [
    {
        sender: 50005,
        text: "Hello, this is JT",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 100,
        text: "Hello, this is Morse",
        date: "Sun Nov 22 2020 10:27:47 GMT-0800"
    },
    {
        sender: 50005,
        text: "How is your project going Morse?",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 50005,
        text: "I'm working on the message page",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 100,
        text: "Hey JT, It's going well",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    }
];
const test_messages_2 = [
    {
        sender: 50005,
        text: "Hello, this is JT",
        date: "Sun Nov 19 2020 03:27:47 GMT-0800"
    },
    {
        sender: 300,
        text: "Hello, this is Morse",
        date: "Sun Nov 20 2020 10:27:47 GMT-0800"
    },
    {
        sender: 50005,
        text: "How is your project going Morse?",
        date: "Sun Nov 21 2020 03:27:47 GMT-0800"
    },
    {
        sender: 50005,
        text: "I'm working on the message page",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 300,
        text: "Hey JT, It's going well",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 300,
        text: "I dont know what to say here it;s just test messages",
        date: "Sun Nov 22 2020 03:27:47 GMT-0800"
    },
    {
        sender: 50005,
        text: "Then let's finish here",
        date: "Sun Nov 23 2020 22:27:47 GMT-0800"
    }
];

const test_conversations = [
    {
        img: img_2,
        conversationId: "03123SJJFH421Jb",
        targetId: 100,
        targetName: "Morse Eunson",
        isGroupChat: false,
        messages: test_messages,
    },
    {
        img: img,

        conversationId: "03123SJJFH421Jb",
        targetId: 300,
        targetName: "Edgard McCreedy",
        isGroupChat: false,
        messages: test_messages_2,

    },
    {
        img: "/",
        conversationId: "03123SJJFH421Jb",
        targetId: 3,
        targetName: "Finding Sf House",
        isGroupChat: true,
        messages: test_messages,
    },
    // {
    //     img: img,
    //     conversationId: "03123SJJFH421Jb",
    //     targetId : 3,
    //     targetName : "Finding Sf House",
    //     isGroupChat: false,
    //     messages: test_messages,

    // },
    // {
    //     img: "/",
    //     conversationId: "03123SJJFH421Jb",
    //     targetId : 3,
    //     targetName : "Finding Sf House",
    //     isGroupChat: true,
    //     messages: test_messages,


    // },
    // {
    //     img: img,
    //     conversationId: "03123SJJFH421Jb",
    //     targetId : 3,
    //     targetName : "Finding Sf House",
    //     isGroupChat: false,
    //     messages: test_messages,

    // },
    // {
    //     img: "/",
    //     conversationId: "03123SJJFH421Jb",
    //     targetId : 3,
    //     targetName : "Finding Sf House",
    //     isGroupChat: true,
    //     messages: test_messages,
    // }
];

const test_property = {
    img: require('../../static/noimg.jpg'),
    title: "Seashore great house",
    city: "San Francisco",
    state: "CA",
    zipcode: "94116",
    price: "312322",
    id: 50003,
    rooms: 3,
    bath_rooms: 2,
    area: 2200,
};


const Messages = ({history, auth}) => {

    useEffect(() => {
        if(!auth.loading && !auth.isAuthenticated)
            history.replace('/');
    })

    return (
        <Fragment>
            <div id="message">
                {!auth.loading && <div className="message-wrap">
                    <ConversationsPane  />
                    <ChatPane user={auth} />
                    <DetailPane userid={auth.id} />
                </div>}
            </div>
        </Fragment>
    );
}

Messages.propTypes = {

    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});
export default connect(mapStateToProps)(Messages)