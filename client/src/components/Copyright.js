import React, { Fragment } from "react";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const Copyright = () => {
    return (
        <Fragment>
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Pocket Realtor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
        </Fragment>
    );
}

export default Copyright