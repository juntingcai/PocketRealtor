import React, { Fragment, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Loading from '../../utils/Loading'
import { useConversations } from '../../context/ConversationsProvider';
import { toPropertyDetail, backgroundPicture } from '../../utils/functions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';


import DirectionsIcon from '@material-ui/icons/Directions';
import { set } from 'date-fns/esm';



const ConversationsPane = () => {


    const [searchChat, setSearchChat] = useState("");

    const { conversations, curConversation, setSelectConversationIndex } = useConversations();


    const onSearch = e => {
        const keyword = e.target.value
        setSearchChat(keyword);
    }


    const Conversation = (conversation, index) => {
        
        const messages = conversation.messages
        if (messages.length === 0 || !conversation.targetName.includes(searchChat))
            return
        const lastMessage = messages[messages.length - 1];
        const curDate = new Date();
        const lastUpdateDate = new Date(lastMessage.date);
        const background = {
            background: conversation === curConversation? "#0001": "#fff",
        }
        return (

            <div className="chat-card" key={index} onClick={() => setSelectConversationIndex(index)} style={background}>
                <div className="chat-wrap">
                    <Avatar alt={conversation.targetName} src={conversation.img} />

                    <div className="info">
                        <div className="title">
                            <span className="name">{conversation.targetName}</span>

                            <span className="last-update">
                                {curDate.getFullYear() === lastUpdateDate.getFullYear() && curDate.getMonth() === lastUpdateDate.getMonth() && curDate.getDate() === lastUpdateDate.getDate() ?
                                    (lastUpdateDate.getHours() + ":" + lastUpdateDate.getMinutes()) : (curDate.getMonth() + "/" + lastUpdateDate.getDate() + "/" + lastUpdateDate.getFullYear())
                                }
                            </span>
                        </div>
                        <div className="last-chat">
                            {lastMessage.content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="left-pane pane">

            {conversations.length === null ? <Loading /> : <><div className="search-bar">
                <Paper component="form">

                    <InputBase
                        value={searchChat}
                        onChange={onSearch}
                        placeholder="Search Chat"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    <SearchIcon style={{ color: '#0008', marginRight: '0.8rem' }} />

                </Paper>
            </div>
                <div className="chat-list">
                    {conversations.map((conversation, index) => (Conversation(conversation, index)))}
                </div></>}
        </div>)
}

export default ConversationsPane;