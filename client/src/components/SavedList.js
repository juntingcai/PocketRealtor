import React, { Fragment, useEffect, useState } from 'react';
import '../css/SavedList.css';
import { withRouter } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { toPropertyDetail } from '../utils/functions';
import Axios from 'axios';

const SavedList = ({history}) => {
    const [data, setData] = useState({
        list: [],
    });

    const deleteSaved = (index) => {
        console.log(index)
        const itemid = data.list[index].id;
        Axios.delete("http://52.53.200.228:3080/tenant/favorite/" + itemid)
            .then(res => {
                if (res.data.code === 10000) {
                    var updateList = data.list
                    updateList.splice(index, 1);
                    setData({
                        list: updateList
                    })
                }

            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        Axios.get("http://52.53.200.228:3080/tenant/favorite/")
            .then(res => {
                console.log(res)
                if (res.data)
                    setData({
                        list: res.data
                    })
            })
            .catch(err => {
                console.log(err)

            })

    }, [])
    return (
        <Fragment>
            <div id="saved-list">
                <div className="saved-list-wrap">
                    <div className="saved-list-title">
                        Saved List
                </div>
                    <div className="saved-list-body">
                        {data.list.map((item, index) => (<div key={index} className="saved-property-card" >
                            <div className="img" onClick={() => toPropertyDetail(history, item.id)}>
                                <img src={require('../static/noimg.jpg')} alt="none" />
                            </div>
                            <div className="info">
                                <div className="title">
                                    {item.title}
                                </div>
                                <div className="address">
                                    {item.city + ", " + item.state + ", " + item.zipcode}
                                </div>
                                <div className="btn">
                                    <DeleteIcon className="delete" style={{ color: "#0005" }} onClick={() => deleteSaved(index)} />
                                </div>
                            </div>

                        </div>))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default withRouter(SavedList)