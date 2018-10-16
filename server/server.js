'use strict';

const sockjs = require('sockjs')
const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true,
	verbose:   true,
})
const json_schema= require('../common/schema/webchat-srv.json')
const validate = ajv.compile(json_schema)

let clients = {}
let buffer = []

function whisper (id, message) {
	if ( !clients[id] ) return
	clients[id].write( JSON.stringify(message) )
}

function broadcast (message, exclude) {
	for ( var i in clients ) {
		if ( i != exclude ) clients[i].write( JSON.stringify(message) )
	}
}

let onData = (id,data) => {

    try {
        data = JSON.parse(data)
    }
    catch(err){
        console.error( err )
        return
    }
    console.log( id + ' : ' + JSON.stringify(data) )

    var valid = validate(data)
    if (valid) {
        console.log('Valid!');
    }
    else {
        console.log( data );
        console.log('Invalid: ' + ajv.errorsText(validate.errors));
        whisper(id, { type: 'error', message: ajv.errorsText(validate.errors), id: id });
        return
    }

    if ( data.type == 'text' ) {
        if ( !data.message ) return;

        data.message = data.message.substr(0, 128);

        if ( buffer.length > 15 ) buffer.shift();
        buffer.push(data.message);

        broadcast({ type: 'message', message: data.message, id: id });
    }

}

let onClose = (id) => {
    delete clients[id];
    broadcast({ type: 'userLeft' });
}

let onConnection = (conn) => {
    clients[conn.id] = conn
    broadcast({ type: 'newUser' }, conn.id)
    whisper(conn.id, { type: 'history', message: buffer, id: conn.id })
    conn.on('data', (data) => { onData(conn.id, data )} )
	conn.on('close', () => { onClose(conn.id )} );
}

module.exports = {

    install: function(http_server, bound) {

        let my_sockjs = sockjs.createServer()
        my_sockjs.installHandlers(http_server, {prefix:'/'+bound})
        my_sockjs.on('connection', onConnection )

    }

}
