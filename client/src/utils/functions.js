import React, { Fragment, useState } from "react";
import { withRouter } from 'react-router-dom';

export const toPropertyDetail = (props, id) => {

    props.history.push({
        pathname: "/property/" + id,

    });
}