import React, { useContext, useEffect, useState, useCallback } from 'react';
import { connect } from "react-redux";
import { useSocket } from './SocketProvider';
import { getConversation, getConversations } from '../utils/functions';

const ConversationsContext = React.createContext();

export function useConversations() {
    return useContext(ConversationsContext);
}

const ConversationsProvider = ({ isAuth, children }) => {
    
    const socket = useSocket();

    const [conversations, setConversations] = useState([]);

    const [selectConversationIndex, setSelectConversationIndex] = useState(0);
    
    const addMessageToConversation = useCallback(({conversationId, message}) => {
        console.log(conversationId, message)
        
        
        setConversations(prevConversations => {
            let createConversation = true;
            const newConversations = prevConversations.map(conversation => {
                if (conversation.conversationId === conversationId) {
                    createConversation = false;
                    return {
                        ...conversation,
                        messages: [
                            ...conversation.messages,
                            message
                        ]
                    }
                }
                else
                    return conversation
            })
            if (createConversation) {
                getConversation(conversationId).then(res => {
                    newConversations.push(res);
                })
            }
            console.log(newConversations)
            return newConversations

        })
    }, [setConversations])

    
    useEffect(() => {
        console.log(isAuth, conversations.length)
        if (isAuth  && conversations.length === 0){
            getConversations().then(conversations => {
                console.log(conversations)
                setConversations(conversations);
            })
        }
        
        if(!socket || socket === null) return;
        
        socket.on('receive-message', addMessageToConversation);

        return () => socket.off('receive-message')

    }, [isAuth, socket])

    const value = {
        conversations: conversations,
        curConversation: conversations[selectConversationIndex],
        setSelectConversationIndex,
        addMessageToConversation,

    }
    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuthenticated,
});


export default connect(mapStateToProps)(ConversationsProvider);