import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid';

// <Grid container direction="column" justify="center" alignItems="center">
    // </Grid>

const Loading = () => 
    <div>
    <Grid item><LinearProgress variant="query" color="secondary" /></Grid>
    </div>

export default Loading;