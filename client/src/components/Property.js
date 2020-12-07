import React, { Fragment, useEffect, useState } from 'react';
import '../css/Property.css';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/AddCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import UnsavedIcon from '@material-ui/icons/FavoriteBorder';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Map from './GoogleMap';
import { toLogin } from '../actions/dialog';
import Axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import { getConversationId, getUserProfile, getPropDetail, addFavorite, deleteFavorite } from '../utils/functions';
import { useSocket } from '../context/SocketProvider';
import { useAlert } from '../context/AlertProvider';
import { useConversations } from '../context/ConversationsProvider';

/*
    prop : {
        
        id
        owner_id
        title
        introduction
        address
        state
        zip_code
        latitude
        longitude
        price
        rooms

    }
*/
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})



const Property = ({ match, history, user, toLogin }) => {
    const socket = useSocket();
    const { setAlert } = useAlert();
    const { addMessageToConversation } = useConversations();
    const [contactForm, setContectForm] = useState({
        name: "",
        phone: "",
        email: "",
        content: ""

    })
    const {
        name,
        phone,
        email,
        content,
    } = contactForm;

    const [data, setData] = useState({
        address: "",
        age: 0,
        area: "",
        bath_rooms: 0,
        city: "",
        description: "",
        id: 0,
        image_links: [],
        latitude: "",
        longitude: "",
        owner_id: 0,
        rent_price: "",
        rooms: 0,
        sale_price: "",
        state: "",
        title: "",
        type: "",
        zip_code: 0,
        forSale: true,
        cooling: true,
        heating: true,
        backyard: true,
        garage: true,
        fireplace: true,
        furnitured: false,
        isFavorite: false,
        isAgent: false,
    })

    const [saler, setSaler] = useState({
        id: 0,
        email: "",
        firstname: "",
        lastname: "",
        nickname: "Jerry",
        birthday: "",
        gender: 1,
        occupation: "",
        intro: "My name is Jerry, I'm a grad student at USF. I'm major in Computer Science. I'm super rich. I owned 10 properties in San Francisco, San Jose an Los Angeles. I'm wanted to sell some of them for fun. I really dont have time to take care these many houses lol.",
        avatar: require('../static/avatar.png'),
    })



    const {
        address,
        age,
        area,
        bath_rooms,
        city,
        description,
        id,
        image_links,
        latitude,
        longitude,
        owner_id,
        rent_price,
        rooms,
        sale_price,
        state,
        title,
        type,
        zip_code,
        forSale,
        cooling,
        heating,
        backyard,
        garage,
        fireplace,
        furnitured,
        isFavorite,
        isAgent,
    } = data

    useEffect(() => {

        if (!match.params.id)
            history.replace('/');
        const pid = match.params.id;
        const type = 1;
        getPropDetail(pid).then(res => {
            setData({
                ...data,
                ...res,
                forSale: type === 1,
            })
        }).catch(err => {
            console.error(err);
            history.replace('/');
        })
        

        if (owner_id !== 0) {

            getUserProfile(owner_id).then(owner => {
                setSaler(owner)
            }).catch(err => alert(err));

        }

        // var links = [require('../static/noimg.jpg'), "none", "none", "none", "none", "none"];
        // setData({
        //     ...data,
        //     image_links: links,
        //     forSale: props.history.location.state.type != 2,
        //     saved: false,

        // })
        if (user.isAuthenticated) {
            setContectForm({
                ...contactForm,
                name: user.firstname + " " + user.lastname,
            })
        }

    }, [user.isAuthenticated, owner_id])

    const onSaveList = () => {

        if (!user.isAuthenticated) {
            toLogin();
            return;
        }

        (isFavorite ? deleteFavorite(id) : addFavorite(id)).then(res => {
            console.log(res)
            setData({
                ...data,
                isFavorite: !isFavorite
            })
            setAlert(2, 'Successful!')
        })

    }

    const handleChangeForm = e => {
        setContectForm({
            ...contactForm,
            [e.target.id]: e.target.value,

        })
    }

    const submitContactForm = () => {
        if (!user.isAuthenticated) return
        console.log(contactForm);


        getConversationId(owner_id, id).then(data => {
            const conversationId = data.conversationId;
            const message = {
                senderId: user.id,
                content: content,
                date: new Date().toString()
            }
            const recipients = [{
                id: saler.id,
                firstname: saler.firstname,
                lastname: saler.lastname,
                avatar: saler.avatar
            }]
            socket.emit('send-message', {
                conversationId, recipients, message
            })
            addMessageToConversation({conversationId, message});
        })
        
    }

    const getObjArray = () => {
        var dataArray = [];
        dataArray.push(data);
        return dataArray;
    }

    const showPicture = (link, index) => {

        var validLink = link === "" ? "#0008" : "url(" + link + ")";
        var firstLink = index === 0;
        const style = {
            float: "left",
            background: validLink,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            width: firstLink ? "50%" : "24.5%",
            height: firstLink ? "100%" : "49.5%",
            marginLeft: firstLink ? "0" : "0.5%",
            marginBottom: "0.5%",
            color: "#fff",



        }
        return (

            <div style={style} key={index}>
                <div className="picture-content">
                    {link === "" && <div>{index}</div>}
                </div>
            </div>

        )



    }

    return (
        <Fragment>
            <div id="property">
                <div className="property-wrap">
                    <div className="title-block">
                        <div className="title">{title}</div>
                        <div className="addr-buttons">
                            <div className="address">{address + ", " + city + ", " + state + " " + zip_code}</div>
                            <div className="buttons">
                                <Button startIcon={<AddIcon className="theme-color" />}>
                                    Group
                            </Button>
                                {isFavorite ? <Button onClick={onSaveList} startIcon={<SavedIcon style={{ color: "red" }} />}>
                                    Saved
                                </Button> : <Button onClick={onSaveList} startIcon={<UnsavedIcon style={{ color: "red" }} />}>
                                        Save
                                </Button>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="picture-block">

                        {
                            image_links.map((link, index) => { return showPicture(link, index) })
                        }

                    </div>

                    <div className="detail-block">
                        <div className="info-block">



                            <div className="amenities">
                                <div className="title">Amenities</div>
                                <div className="spec">
                                    <div className="spec-left">
                                        <div className="tye"><span>{"Type: "}</span>{type}</div>
                                        <div className="bedroom"><span>{"Bedroom: "}</span> {rooms}</div>
                                        <div className="bathroom"><span>{"Bathroom: "}</span>{bath_rooms}</div>
                                        <div className="lot"><span>{"Lot: "}</span>{area + " sqft"}</div>
                                        <div className="built"><span>{"Year built: "}</span>{age}</div>
                                        <div className="finish"><span>{"Year finish: "}</span>{age}</div>


                                    </div>
                                    <div className="spec-right">
                                        <div className="furniture"><span>{"Furnitured: "}</span>{(furnitured ? "Yes" : "No")}</div>
                                        <div className="garage"><span>{"Garage: "}</span>{(garage ? "Yes" : "No")}</div>
                                        <div className="backyard"><span>{"Backyard: "}</span>{(backyard ? "Yes" : "No")}</div>
                                        <div className="Cooling"><span>{"Cooling: "}</span>{(cooling ? "Yes" : "No")}</div>
                                        <div className="Heating"><span>{"Heating: "}</span>{(heating ? "Yes" : "No")}</div>
                                        <div className="fireplace"><span>{"Fireplace: "}</span>{(fireplace ? "Yes" : "No")}</div>


                                    </div>
                                </div>

                            </div>
                            <div className="description">
                                <div className="title">Description</div>
                                <div className="content">{description}</div>

                            </div>
                            <div className="saler">

                                <div className="info">


                                    <div className="name">{"Host by " + saler.nickname}</div>
                                    <div className="role">{isAgent ? "Agent" : "Owner"}</div>

                                    <div className="intro">{saler.intro}</div>

                                </div>
                                <Avatar alt="" src={saler.avatar} />


                            </div>
                            <div className="map">
                                <div className="title">Location</div>
                                <div className="map-frame">
                                    <Map data={{
                                        lat: Number(latitude),
                                        lng: Number(longitude),
                                        list: getObjArray(),
                                        zoom: 14,
                                    }} />
                                </div>

                            </div>
                        </div>
                        <div className="contact-block">
                            <div className="apply">
                                <div className="type">{type + " for " + (forSale ? "sale" : "rent")}</div>
                                <div className="price">
                                    {formatter.format(forSale ? sale_price : rent_price)}
                                    {/* <span id="slash">/</span><span id="small">{forSale ? " total" : " month"}</span> */}

                                </div>
                                <div className="apply-btn">
                                    <Button variant="contained" color="primary" >
                                        Apply For Property
                                    </Button>

                                </div>
                            </div>
                            <div className="contact">
                                <div className="contact-text">
                                    Contact Host
                                </div>
                                <FormControl variant="outlined">
                                    <OutlinedInput
                                        id="name"
                                        value={name}
                                        onChange={handleChangeForm}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PersonRoundedIcon />
                                            </InputAdornment>
                                        }
                                        aria-describedby="name"
                                        placeholder={"Full Name"}
                                    />

                                </FormControl>
                                <FormControl variant="outlined">
                                    <OutlinedInput
                                        id="phone"
                                        value={phone}
                                        onChange={handleChangeForm}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PhoneRoundedIcon />
                                            </InputAdornment>
                                        }
                                        aria-describedby="phone"
                                        placeholder={"Phone Number"}
                                    />

                                </FormControl>
                                <FormControl variant="outlined">
                                    <OutlinedInput
                                        id="email"
                                        value={email}
                                        onChange={handleChangeForm}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon />
                                            </InputAdornment>
                                        }
                                        aria-describedby="email"
                                        placeholder={"Email Address"}
                                    />

                                </FormControl>

                                <FormControl variant="outlined">
                                    <OutlinedInput
                                        id="content"
                                        value={content}
                                        onChange={handleChangeForm}
                                        multiline
                                        rows={4}
                                        aria-describedby="content"
                                        placeholder={"Enter Message"}
                                    />

                                </FormControl>
                                <Button variant="contained" className="theme-color-bg-2 contact-btn" disableElevation onClick={submitContactForm}>
                                    Contact Host
                                </Button>

                            </div>
                        </div>

                    </div>

                    <div className="suggest-block">
                        <div className="title">
                            More similar properties nearby
                        </div>
                        <div className="prop-list">
                            Coming soon
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

Property.propTypes = {
    toLogin: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth
});

export default withRouter(connect(mapStateToProps, { toLogin })(Property))