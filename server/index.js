'use strict';

const http = require('http')

// const Server = require('./server')

const server = http.createServer()
server.listen(9999, '0.0.0.0')
console.log(' [*] Listening on 0.0.0.0:9999')

function whisper (id, message) {
	if ( !clients[id] ) return;

	clients[id].write( JSON.stringify(message) );
}

function broadcast (message, exclude) {
	for ( var i in clients ) {
		if ( i != exclude ) clients[i].write( JSON.stringify(message) );
	}
}

// const my_server = new Server()
// my_server.install( server )
let onConnection = (conn) => {
  clients[conn.id] = conn;
  broadcast({ type: 'newUser' }, conn.id);
	whisper(conn.id, { type: 'history', message: buffer, id: conn.id });

	conn.on('data', function onDataCB (data) {
		data = JSON.parse(data);

		if ( data.type == 'text' ) {
			if ( !data.message ) return;

			data.message = data.message.substr(0, 128);

			if ( buffer.length > 15 ) buffer.shift();
			buffer.push(data.message);

			broadcast({ type: 'message', message: data.message, id: conn.id });
		}

		// TODO: add user name
	});

	conn.on('close', function onCloseCB () {
		delete clients[conn.id];

		broadcast({ type: 'userLeft' });
	});
}

var clients = {};
var buffer = [];

const sockjs = require('sockjs');
const my_sockjs = sockjs.createServer()
my_sockjs.installHandlers(server, {prefix:'/chat'});
my_sockjs.on('connection', onConnection )
