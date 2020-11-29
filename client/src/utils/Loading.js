import React, { Fragment } from "react";
import spinner from '../static/spinner.gif';

const Loading = () => {
    const style = {
        display: "flex",
        alignItem: "center",
        width: "100%",
        height: "100%"

    }
    return (
        <Fragment>
            <div className="loading" style={style}>
                <img
                    src={spinner}
                    style={{ width: "200px", margin: "auto", display: "block" }}
                    alt={"Loading..."}
                />
            </div>

        </Fragment>
    );
};

export default Loading;