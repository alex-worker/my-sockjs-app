import React from 'react';
import {Header, Footer} from './layouts/'
import Login from './pages/Login'
import Loading from './pages/Loading'
import Grid from '@material-ui/core/Grid'

import conf from '../../common/config'
import Client from './client'

// const client = new Client()
var client

class App extends React.Component {

    state = {
        mode: 'login'
        // mode: 'loading'
    }

    // processClient( mess ){
    //     console.log( mess )
    // }


    tryConnect() {

        let processClient = (mess) => {
            console.log( mess )
        }
    
        console.log( 'try connect ')
        this.setState( {mode:'loading'} )
        client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient.bind(this) );
        client.connect();
    }

    getCurrentPage( mode ){
        if (mode==='login')
            return <Login onSubmit={this.tryConnect.bind(this)} />
        if (mode==='loading')
            return <Loading />
        return null
    }

    render() {
        let {mode} = this.state
        return <>
        <Header />
        <Grid container 
            direction="column" 
            justify="center" 
            alignItems="center" 
            className='customDiv'>
        { this.getCurrentPage(mode) }
        </Grid>
        <Footer />
        </>
    }
    
}

export default App;