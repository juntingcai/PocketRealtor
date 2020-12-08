import React, { Fragment, useEffect, useState } from 'react';
import '../css/SavedList.css';
import { withRouter } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { toPropertyDetail, getSavedList, deleteFavorite } from '../utils/functions';
import Loading from '../utils/Loading';


const SavedList = ({ history }) => {
    const [list, setList] = useState(null);

    const deleteSaved = (index) => {
        console.log(index)
        const pid = list[index].id;
        deleteFavorite(pid)
            .then(() => {
                setList(prevList => {
                    return prevList.filter(item => {
                        return item.id !== pid;
                    })
                })
            })
    }

    useEffect(() => {
        getSavedList()
            .then(res => {
                console.log(res)
                setList(res)
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
                        {list === null ? <Loading /> : list.map((item, index) => (<div key={index} className="saved-property-card" >
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