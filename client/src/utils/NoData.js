import React, { Fragment } from "react";

const NoData = () => {
    const style = {
        display: "flex",
        alignItem: "center",
        width: "100%",
        height: "100%",
    }

    const innerDiv = {
        textAilgn: "center",
        width: "100%",
        fontSize: "2em",
    }
    return (
        <Fragment>
            <div className="NoData" style={style}>
                <div style={innerDiv}>
                    No Data
                </div>
                <div style={innerDiv}>
                    Avaliable
                </div>
            </div>

        </Fragment>
    );
};

export default NoData;