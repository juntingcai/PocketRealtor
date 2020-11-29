import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import { useConversations } from '../../context/ConversationsProvider';
import Loading from '../../utils/Loading';
import { useSocket } from '../../context/SocketProvider';
import { toPropertyDetail, backgroundPicture, getUserProfile, getGroup } from '../../utils/functions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { set } from 'date-fns/esm';
import NoData from '../../utils/NoData';
//import { useAtom } from '../../utils/useAtom';

function useRecipients(conversation, user) {
    const [state, setState] = useState({ status: 'loading' })

    useEffect(() => {
        if (state.status !== 'loading') {
            setState({ status: 'loading' })
        }

        if (conversation) {

            console.log("get recipients 1")
            if (!conversation.isGroupChat) {
                getUserProfile(conversation.targetId)
                    .then(data => {
                        const recipients = [{
                            id: data.id,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            avatar: data.avatar
                        }];
                        console.log("1111", conversation.targetId, recipients)
                        setState({ status: 'ready', recipients })

                    }).catch(error => setState({ status: 'aborted', error }));
            }
            else {
                getGroup(conversation.targetId)
                    .then(data => {
                        console.log(data)
                        const recipients = [];
                        if (data.owner.id !== user.id)
                            recipients.push(data.owner)
                        data.members.forEach(member => {
                            if (member.id !== user.id)
                                recipients.push(member);
                        });
                        console.log(recipients);
                        //setData(conversation.conversationId, 'recipients', recipients)
                        setState({ status: 'ready', recipients })
                    }).catch(error => setState({ status: 'aborted', error }));
            }

        }

    }, [conversation.targetId])

    return state
}


const ChatPane = ({ user }) => {
    const socket = useSocket();
    //const [recipients, setRecipients] = useState(null);
    const [input, setInput] = useState("");
    const setLastMessageRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    const { curConversation, addMessageToConversation } = useConversations();
    const recipientsState = useRecipients(curConversation, user);


    const submitMessage = (e) => {
        e.preventDefault();
        const message = {
            senderId: user.id,
            content: input,
            date: new Date().toString()
        }
        console.log(message)

        socket.emit('send-message', { conversationId: curConversation.conversationId, recipients: recipientsState.recipients, message });

        addMessageToConversation({ conversationId: curConversation.conversationId, message });
    }

    const Message = (message, index) => {

        const isLastMessage = (index === curConversation.messages.length - 1)
        const isUser = message.senderId === user.id;
        const sender = isUser ? user : recipientsState.recipients.find(recipient => {
            return recipient.id === message.senderId;
        })

        const style = {
            display: "flex",
            flexDirection: isUser ? "row-reverse" : "row",
            textAlign: "left",
        };

        const color = isUser ? "#1634d8" : "#0004";

        const contentStyle = {
            borderRadius: "0.5rem",
            padding: "0.6rem",
            boxSizing: "border-box",
            background: color,
            color: "#fff",
            fontWeight: "500",
            fontSize: "1.1rem",
            position: "relative",
            left: isUser ? "0.62rem" : "unset",
            right: isUser ? "unset" : "0.62rem",
    
        }


        return (

            <div key={index} className="chat-record" style={style} ref={isLastMessage ? setLastMessageRef : null}>
                <div className="avatar" style={{
                    background: "url(" + sender.avatar + ")", backgroundPosition: "center center",
                    backgroundSize: "cover"
                }} />
                <div className="chat-content" style={{ flex: "1", maxWith: "70%" }}>
                    {!isUser && <div className="userid" style={{ margin: "0 0.5rem 0.2rem 0.5rem" }}>
                        {sender.firstname + " " + sender.lastname}
                    </div>}
                    <div className="chat-bubble" style={style}>


                        {isUser ? <ArrowRightIcon style={{ color: color }} /> : <ArrowLeftIcon style={{ color: color }} />}
                        <div className="content" style={contentStyle}>
                            {message.content}
                        </div>
                    </div>
                </div>
            </div>

        )
    }




    // useEffect(() => {
    //     if(!curConversation || curConversation === null) return;

    //     if (!curConversation.recipients) {

    //         console.log("get recipients 1")
    //         if (!curConversation.isGroupChat) {
    //             getUserProfile(curConversation.targetId)
    //                 .then(data => {
    //                     const recipients = [{
    //                         id: data.id,
    //                         firstname: data.firstname,
    //                         lastname: data.lastname,
    //                         avatar: data.avatar
    //                     }];
    //                     console.log("1111", curConversation.targetId, recipients)
    //                     setRecipients(recipients)

    //                 }).catch(err => alert(err));
    //         }
    //         else {
    //             getGroup(curConversation.targetId)
    //                 .then(data => {
    //                     console.log(data)
    //                     const recipients = [];
    //                     if (data.owner.id !== user.id)
    //                         recipients.push(data.owner)
    //                     data.members.forEach(member => {
    //                         if (member.id !== user.id)
    //                             recipients.push(member);
    //                     });
    //                     //console.log(recipients);
    //                     //setData(conversation.conversationId, 'recipients', recipients)
    //                     setRecipients(recipients);
    //                 }).catch(err => alert(err));
    //         }

    //     }
    //     else{
    //         console.log("get recipients ")
    //         console.log(curConversation.recipients);
    //         setRecipients(curConversation.recipients)
    //     }

    // }, [curConversation])


    return (
        <div className="mid-pane pane">
            { recipientsState.status === 'loading' && <Loading />}
            { recipientsState.status === 'aborted' && <NoData />}
            { recipientsState.status === 'ready' &&
                <>
                    <div className="title">
                        {curConversation.targetName}
                    </div>
                    <div className="chat-wrap">
                        <div className="chat-history">
                            {curConversation.messages.map((message, index) => (Message(message, index)))}
                        </div>
                        <form className="chat-input" onSubmit={submitMessage}>

                            <IconButton color="primary" aria-label="add-picture">
                                <ImageRoundedIcon />
                            </IconButton>
                            <div className="text-input">
                                <TextareaAutosize
                                    rowsMax={4}
                                    aria-label="maximum height"
                                    placeholder="Enter Message"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                            <IconButton color="primary" aria-label="send-message" type="submit">
                                <SendRoundedIcon />
                            </IconButton>

                        </form>
                    </div>
                </>
            }
            {/* { recipients === null ? <Loading />: <>
                <div className="title">
                    {curConversation.targetName}
                </div>
                <div className="chat-wrap">
                    <div className="chat-history">
                        {curConversation.messages.map((message, index) => (Message(message, index)))}
                    </div>
                    <form className="chat-input" onSubmit={submitMessage}>

                        <IconButton color="primary" aria-label="add-picture">
                            <ImageRoundedIcon />
                        </IconButton>
                        <div className="text-input">
                            <TextareaAutosize
                                rowsMax={4}
                                aria-label="maximum height"
                                placeholder="Enter Message"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <IconButton color="primary" aria-label="send-message" type="submit">
                            <SendRoundedIcon />
                        </IconButton>

                    </form>
                </div>
            </>} */}
        </div>)

}

export default ChatPane;