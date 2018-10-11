import React from 'react'
import ReactDOM from 'react-dom'
import Login from './pages/Login'
import SockJS from 'sockjs-client'


var sock;


const tryConnect = ( username ) => {
    console.log( 'index try connect:' + username )

    sock = new SockJS('http://127.0.0.1:9999/chat')
    sock.onopen = function() {
        console.log('open')
        sock.send('test')
    }

    sock.onmessage = function(e) {
        console.log('message', e.data)
        // sock.close();
    }

    sock.onclose = function() {
        console.log('close')
    }

}

import './index.scss'
import Footer from './layouts/Footer';
const App = () => (
    <div>
    <Login onSubmit={tryConnect} />
    <Footer />
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'));
