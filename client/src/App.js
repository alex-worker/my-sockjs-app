import React from 'react';
import {Header, Footer} from './layouts/'
import Login from './pages/Login'
import Loading from './pages/Loading'
import Chat from './pages/Chat'

import Grid from '@material-ui/core/Grid'

import conf from '../../common/config'
import Client from './client'

import Snackbar from '@material-ui/core/Snackbar';

var client

class App extends React.Component {

    state = {
        username: 'guest',
        history: [],
        message: '',
        mode: 'login',
        error: ''
    }

    constructor(){ 
        super()
        this.callbackArray = []

        this.chatRef = React.createRef();

        // transport layer:
        this.callbackArray['-close'] = this.onClose.bind(this)
        this.callbackArray['-open'] = this.onOpen.bind(this)
        this.callbackArray['-packet'] = this.onPacket.bind(this)

        // message layer:
        this.callbackArray['message'] = this.onMessage.bind(this)
        this.callbackArray['history'] = this.onHistory.bind(this)
    }

    processClient( mess ){
        if ( this.callbackArray[mess.type] === undefined ) {
            console.error('unsupported type:' + mess.type )
            return
        }
        this.callbackArray[mess.type]( mess )
    }

    onOpen(){
        this.setState( {mode: 'chat', error: ''} )
    }

    onPacket( packet ){
        this.processClient( JSON.parse(packet.message) )
    }

    onCloseSnackbar(){
        this.setState( {error:''} )
    }

    onClose(){
        this.setState( {mode: 'login', error: 'server is closed'} )
    }

    onMessage( mess ){
        console.log( '---message:')
        console.log( mess )
        this.setState( {message: mess.message } )
    }

    onHistory( mess ){
        console.log( '---history:')
        console.log( mess.message )
        // this.setState( {history: mess.message } )
        this.chatRef.current.setHistory( mess.message )
        // console.log( this.chatRef )
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
        if (mode==='chat')
            return <Chat ref={this.chatRef} />
        console.error( 'unsupported mode: '+mode)
        return null
    }

    render() {
        let { mode, error } = this.state
        return <>
        <Header />
        <Grid container 
            direction="column" 
            justify="center" 
            alignItems="center" 
            className='customDiv'>
        { this.getCurrentPage(mode) }
        </Grid>
        <Snackbar
            vertical='bottom'
            horizontal='center'
            message={error}
            open={ (error === '')?false:true }
            onClose={ this.onCloseSnackbar.bind(this) }/>
        <Footer />
        </>
    }
    
}

export default App;