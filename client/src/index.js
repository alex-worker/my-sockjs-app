import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
// import Login from './pages/Login'
// import SockJS from 'sockjs-client'

// import {Header, Footer} from './layouts/'

// var sock;

// const tryConnect = ( username ) => {
//     console.log( 'index try connect:' + username )

//     sock = new SockJS('http://127.0.0.1:9999/chat')
//     sock.onopen = function() {
//         console.log('open')
//         sock.send('test')
//     }

//     sock.onmessage = function(e) {
//         console.log('message', e.data)
//         // sock.close();
//     }

//     sock.onclose = function() {
//         console.log('close')
//     }

// }

import './index.scss'


ReactDOM.render(<App />, document.getElementById('root'));
