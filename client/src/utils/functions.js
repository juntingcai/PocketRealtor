import React, { Fragment, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { get, post, axioDelete, put } from './axios';

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

export function getConversationId(hostId, listingId) {

    const params = {
        hostId: hostId,
        listingId: listingId
    }
    return get("conversation/find/", params);
        
    //     axios.get("http://52.53.200.228:3080/conversation/find/?" +
    //         "hostId=" + hostId +
    //         "&listingId=" + listingId
    //     ).then(res => {
    //         if (res.data)
    //             resolve(res.data)
    //         else
    //             reject(res.data.msg)
    //     }).catch(err => {
    //         reject(err);
    //     })
    // })
}

export function getUserProfile(userid) {
    return new Promise((resolve, reject) => {
        get("user/" + userid)
            .then(res => {
                if (res.data)
                    resolve(res.data)
                else
                    reject(res.msg)
            })
            .catch(err => {
                reject(err);
            })
    })
}
export function getGroup(groupId) {
    return get("tenant/group/" + groupId)
            
}

// export function getConversations() {
//     return new Promise((resolve, reject) => {
//         axios.get("http://52.53.200.228:3080/conversation/all")
//             .then(res => {
//                 if (res.data)
//                     resolve(res.data)
//                 else
//                     reject(res.msg)

//             })
//             .catch(err => {
//                 reject(err);
//             })
//     })
// }
export function getConversations() {
    return get("conversation/all")
}

export function getProperty(pid) {
    return new Promise((resolve, reject) => {
        axios.get("http://52.53.200.228:3080/listing/" + pid)
            .then(res => {
                if (res.data) {
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
    return get("conversation/get/" + conversationId);
}



export function loginUser(email, password) {

    const body = JSON.stringify({ email, password });

    return post('user/login', body);
};

export function registerUser(firstname, lastname, email, password) {

    const body = JSON.stringify({ firstname, lastname, email, password });

    return post('user/register', body);
}

export function searchProperties(searchProps) {
    const param = {
        ...searchProps,
    }
    if (param.maxPrice === 0) {
        delete param.minPrice;
        delete param.maxPrice;
    }
    if (param.bedrooms === 0)
        delete param.bedrooms;
    if (param.bathrooms === 0)
        delete param.bathrooms;

    return get('listings', param);
}

export function getPropDetail(pid) {
    return new Promise((resolve, reject) => {
        get("listing/" + pid)
            .then(data => {
                console.log(data)
                data.image_links[0] = require('../static/noimg.jpg');
                resolve(data);

            })
            .catch(err => {
                console.log(err)
                reject(err);
            })
    })
}

export function addFavorite(id) {

    return put('tenant/favorite/' + id);
}

export function deleteFavorite(id) {

    return axioDelete('tenant/favorite/' + id);
}


