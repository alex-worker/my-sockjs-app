import React from 'react';
import {Header, Footer} from './layouts/'
import Login from './pages/Login'
import Loading from './pages/Loading'
import Chat from './pages/Chat'

import 'normalize.css'
import './index.scss'

import conf from '../../common/config'
import Client from './client'

var client

class App extends React.Component {

    state = {
        username: 'guest',
        mode: 'login',
        error: '',
        history: []
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
        this.callbackArray['newUser'] = this.onNewUser.bind(this)
        this.callbackArray['userLeft'] = this.onUserLeft.bind(this)
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
        // console.log( '---message:')
        // console.log( mess )
        // this.setState( {message: mess.message } )
        this.chatRef.current.addMessage( mess.id, mess.message )
    }

    onUserLeft( mess ){
        // console.log('user left')
        console.log( mess )
        this.onMessage( { id:'system', message:'user left'})
    }

    onNewUser( mess ){
        // console.log('new user:')
        console.log( mess )
        this.onMessage( { id:'system', message:'new user'} )
    }

    onHistory( mess ){
        // console.log( '---history:')
        // console.log( mess.message )
        this.chatRef.current.setHistory( mess.message )
    }

    tryConnect(username) {
        console.log( 'try connect ')
        this.setState( {mode:'loading', username:username} )
        client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, this.processClient.bind(this) );
        client.connect();
    }

    showErrorMessage(error){
        if (error==='') return null
        let myClass = 'error';
        return <div className={myClass}>
        {error}
        </div>
    }

    getCurrentPage( mode ){
        if (mode==='login')
            return <Login username={this.state.username} onSubmit={this.tryConnect.bind(this)} />
        if (mode==='loading')
            return <Loading />
        if (mode==='chat')
            return <Chat ref={this.chatRef} history={this.state.history} />
        console.error( 'unsupported mode: '+mode)
        return null
    }

    render() {
        let { mode, error } = this.state
        return <>
        <Header />
        <div className='central'>
        { this.getCurrentPage(mode) }
        </div>
        { this.showErrorMessage(error) }
        <Footer />
        </>
    }
    
}

export default App;