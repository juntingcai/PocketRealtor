import React, { useEffect, useState } from 'react';
import { toPropertyDetail, backgroundPicture, getGroup } from '../../utils/functions';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Loading from '../../utils/Loading';
import { getProperty } from '../../utils/functions';
import { useConversations } from '../../context/ConversationsProvider';
import { useAlert } from '../../context/AlertProvider';
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


const DetailPane = ({ history }) => {
    const { setAlert } = useAlert();

    const [detail, setDetail] = useState(null);

    const { curConversation } = useConversations();

    useEffect(() => {
        if(!curConversation || curConversation === null) return;

        if (!curConversation.detail) {

            (curConversation.isGroupChat ? getGroup(curConversation.targetId) : getProperty(curConversation.targetId))
                .then(data => {
                    console.log(data)
                    //setData(conversation.conversationId, 'detail', data)
                    setDetail(data)
                }).catch(err => setAlert(0, err));

        }
        else {
            
            setDetail(curConversation.detail);
        }

    }, [curConversation])

    
    return (

        <div className="right-pane pane">
            {detail === null ? <Loading /> : <>
                <div className="title">
                    Detail
                </div>

                <div className="detail">
                    {/* {curConversation.isGroupChat ?
                        <>
                            <div className="member-block">
                                <div className="group">
                                    <div className="title">
                                        Group Members
                                    </div>
                                    <div className="member-list">
                                        {recipients.map((person, index) => (
                                            <div className="member-card" key={index}>
                                                <Avatar alt="" src={person.avatar} />
                                                <div className="name">
                                                    {person.nickname}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="detail-btn">
                                        <Button variant="outlined" >Group Detail</Button>

                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <div className="member-block">
                                <div className="person">

                                    <div className="info">
                                        <Avatar alt="" src={recipent.avatar} />
                                        <div className="name-role">
                                            <div className="name">{recipent.nickname}</div>
                                            <div className="role">{recipent.role === 1 ? "Tenant" : "Host"}</div>
                                        </div>

                                    </div>
                                    <div className="intro-title">
                                        {"About " + recipent.nickname}
                                    </div>
                                    <div className="intro">{recipent.intro}</div>
                                </div>
                            </div>
                            <div className="property-block">
                                <div className="title">
                                    {"Relative Property"}
                                </div>

                                <div className="img">
                                    {backgroundPicture(require('../../static/noimg.jpg'))}
                                </div>
                                <div className="info">
                                    <div className="title">
                                        {property.title}
                                    </div>
                                    <div className="address">
                                        {property.city + ", " + property.state + ", " + property.zipcode}
                                    </div>
                                    <div className="property-rooms">
                                        <span>{property.rooms} bedrooms</span>
                                        <div className="divider" />
                                        <span>{property.bath_rooms} baths</span>
                                        <div className="divider" />
                                        <span>{property.area} sqft</span>
                                    </div>
                                </div>
                                <div className="detail-btn">
                                    <Button variant="outlined" onClick={() => toPropertyDetail(history, property.id)}>View Detail</Button>
                                </div>
                            </div>
                        </>
                    } */}
                </div>
            </>}
        </div>

    )
}

export default withRouter(DetailPane);