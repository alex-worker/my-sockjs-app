import React from 'react';
import {AppBar,Toolbar,Typography} from '@material-ui/core'

const Header = () => 
    <AppBar position='static'>
    <Toolbar>
        <Typography variant='h5' color='inherit'>my-sockjs-app</Typography>
    </Toolbar>
    </AppBar>

export default Header;