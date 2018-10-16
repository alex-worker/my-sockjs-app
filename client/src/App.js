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
        username: 'guest',
        mode: 'login',
        error: ''
    }

    constructor(){ 
        super()
        this.callbackArray = []
        this.callbackArray['close'] = this.onClose.bind(this)
    }

    processClient( mess ){
        if ( this.callbackArray[mess.type] === undefined ) {
            console.error('unsupported type:' + mess.type )
            return
        }
        this.callbackArray[mess.type]()
    }

    onClose(){
        console.log('on close')
        this.setState( {mode: 'login', error: 'server closed'} )
    }

    tryConnect(username) {

        console.log( 'try connect ')
        this.setState( {mode:'loading', username:username} )
        client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, this.processClient.bind(this) );
        client.connect();

    }

    getCurrentPage( mode ){
        if (mode==='login')
            return <Login username={this.state.username} onSubmit={this.tryConnect.bind(this)} />
        if (mode==='loading')
            return <Loading />
        return null
    }

    render() {
        let { mode } = this.state
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