import React, { Fragment, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

export const toPropertyDetail = (history, id) => {

    history.push({
        pathname: "/property/" + id,

    });
}

export const backgroundPicture = (src) => {
    const style = {
        background: "url(" + src + ")",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        width: "100%",
        height: "100%",
    }
    return (
        <div className="bg" style={style} />
    )
}

export function getConversationId(recipients) {
    //check if exist
    const conversationId = uuidv4();
    return conversationId;
}

export function getUserProfile(userid) {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/user/" + userid)
            .then(res => {
                if(res.data.data)
                    resolve(res.data.data)
                else
                    reject(res.data.msg)
            })
            .catch(err => {
                reject(err);
            })
    })
}
export function getGroup(groupId) {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/tenant/group/" + groupId)
            .then(res => {
                if(res.data)
                    resolve(res.data)
                else
                    reject(res.msg);
                
            })
            .catch(err => {
                reject(err);
            })
    })
}

export function getConversations() {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/conversation/all")
            .then(res => {
                if(res.data)
                    resolve(res.data)
                else
                    reject(res.msg)
                
            })
            .catch(err => {
                reject(err);
            })
    })
}

export function getProperty(pid) {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/listing/" + pid)
            .then(res => {
                if(res.data){
                    res.data.image_links[0] = require('../static/noimg.jpg');
                    resolve(res.data);
                }
                    
                else
                    reject(res.msg)
            })
            .catch(err => {
                reject(err);
            })
    })
}

export function getConversation(conversationId) {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/conversation/get/" + conversationId)
            .then(res => {
                if(res.data){
                    resolve(res.data);
                }
                    
                else
                    reject(res.msg)
            })
            .catch(err => {
                reject(err);
            })
    })
}

