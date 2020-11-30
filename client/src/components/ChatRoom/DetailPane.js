import React, { useEffect, useState } from 'react';
import { toPropertyDetail, backgroundPicture, getGroup } from '../../utils/functions';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Loading from '../../utils/Loading';
import { getProperty } from '../../utils/functions';
import { useConversations } from '../../context/ConversationsProvider';
import { useAlert } from '../../context/AlertProvider';
import NoData from '../../utils/NoData';


function useDetail(curConversation) {
    const [state, setState] = useState({ status: 'loading' })

    useEffect(() => {
        if (state.status !== 'loading') {
            setState({ status: 'loading' })
        }

        if (!curConversation || curConversation === null) return;

        if (!curConversation.detail) {

            (curConversation.isGroupChat ? getGroup(curConversation.targetId) : getProperty(curConversation.listingId))
                .then(detail => {
                    console.log(detail)
                    //setData(conversation.conversationId, 'detail', data)
                    setState({ status: 'ready', section: (curConversation.isGroupChat ? 1 : 2), data: detail });
                }).catch(err => setState({ status: 'aborted', err }));

        }

        return () => setState({ status: 'loading' })

    }, [curConversation])

    return state
}


const DetailPane = ({ history }) => {
    const { setAlert } = useAlert();

    //const [detail, setDetail] = useState(null);

    const { curConversation } = useConversations();

    const detail = useDetail(curConversation)
    // useEffect(() => {
    //     setDetail(null);
    //     if(!curConversation || curConversation === null) return;

    //     if (!curConversation.detail) {

    //         (curConversation.isGroupChat ? getGroup(curConversation.targetId) : getProperty(curConversation.targetId))
    //             .then(data => {
    //                 console.log(data)
    //                 //setData(conversation.conversationId, 'detail', data)
    //                 setDetail(data)
    //             }).catch(err => setAlert(0, err));

    //     }
    //     else {

    //         setDetail(curConversation.detail);
    //     }

    // }, [curConversation])


    return (

        <div className="right-pane pane">
            <div className="title"> Detail </div>

            <div className="detail">

                {detail.status === 'loading' && <Loading />}
                {detail.status === 'aborted' && <NoData />}
                {detail.status === 'ready' && detail.section === 1 && <>

                    <div className="member-block">
                        <div className="group">
                            <div className="title">
                                {curConversation.targetName}
                            </div>
                            <div className="group-intro">
                                {curConversation.targetDescription}
                            </div>

                            <div className="sub-title">
                                Group Owner
                            </div>
                            <div className="owner">

                                <Avatar alt="" src={detail.data.owner.avatar} />
                                <div className="owner-info">
                                    <div className="name">{detail.data.owner.firstname + " " + detail.data.owner.lastname}</div>
                                    <div>Owner</div>
                                </div>
                            </div>


                            <div className="sub-title">
                                Group Members
                            </div>
                            <div className="member-list">
                                        {detail.data.members.map((person, index) => (
                                            <div className="member-card" key={index}>
                                                <Avatar alt="" src={person.avatar} />
                                                <div className="name">
                                                    {person.firstname + " " + person.lastname}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="detail-btn">
                                        <Button variant="outlined" >Group Detail</Button>

                                    </div>
                        </div>
                    </div>
                </>}
                {detail.status === 'ready' && detail.section === 2 && <>
                    <div className="member-block">
                        <div className="person">

                            <div className="info">
                                <Avatar alt="" src={curConversation.img} />
                                <div className="name-role">
                                    <div className="name">{curConversation.targetName}</div>
                                    <div className="role">{curConversation.targetId === detail.data.owner_id ? "Host" : "Tenant"}</div>
                                </div>

                            </div>
                            <div className="intro-title">
                                {"About " + curConversation.targetName}
                            </div>
                            <div className="intro">{curConversation.targetDescription}</div>
                        </div>
                    </div>
                    <div className="property-block">
                        <div className="title">
                            {"Relative Property"}
                        </div>

                        <div className="img">
                            {backgroundPicture(detail.data.image_links[0])}
                        </div>
                        <div className="info">
                            <div className="title">
                                {detail.data.title}
                            </div>
                            <div className="address">
                                {detail.data.city + ", " + detail.data.state + " " + detail.data.zip_code}
                            </div>
                            <div className="property-rooms">
                                <span>{detail.data.rooms} bedrooms</span>
                                <div className="divider" />
                                <span>{detail.data.bath_rooms} baths</span>
                                <div className="divider" />
                                <span>{detail.data.area} sqft</span>
                            </div>
                        </div>
                        <div className="detail-btn">
                            <Button variant="outlined" onClick={() => toPropertyDetail(history, detail.data.id)}>View Detail</Button>
                        </div>
                    </div>
                </>}
            </div>
        </div >

    )
}

export default withRouter(DetailPane);