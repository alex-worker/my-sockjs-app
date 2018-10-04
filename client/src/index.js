import React from 'react'
import ReactDOM from 'react-dom'
// import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
// import Home from './containers/Home';
// import About from './containers/About';

import SockJS from 'sockjs-client'

var sock = new SockJS('http://127.0.0.1:9999/chat');
sock.onopen = function() {
    console.log('open');
    sock.send('test');
};

sock.onmessage = function(e) {
    console.log('message', e.data);
    // sock.close();
};

sock.onclose = function() {
    console.log('close');
};

import './index.scss';
const App = () => (
    <div>
        Hello!
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
