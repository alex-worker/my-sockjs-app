'use strict';

const uuidv5 = require('uuid/v5')

const sockjs = require('sockjs')
const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true,
	verbose:   true,
})
const json_schema= require('../common/schema/webchat-srv.json')
const validate = ajv.compile(json_schema)

const namespace_uid = 'cce99b65-f057-49ae-b75c-1ebbd353bc8c'

let clients = {}
let buffer = []
let clients_info = {}

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

    // if ( clients_name[id] === undefined ){ // проверяем зарегался ли читатель под своим ником
    //     clients[id].close( 500, 'couth people say hello!');
    // }

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
        if ( !data.message ) return

        data.message = data.message.substr(0, 128)

        if ( buffer.length > 515 ) buffer.shift()
        buffer.push(data.message)

        broadcast({ type: 'message', message: data.message, id: id })
        return
    }

    if ( data.type == 'hello' ) {
        console.log( 'client say hello: ' + data.message )
    }

}

let onClose = (id) => {
    delete clients[id];
    broadcast({ type: 'userLeft' });
}

let onConnection = (conn) => {
    // console.log( conn._session.recv.ws._stream )
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

    },

    addUser: function(username) {
        
        let uid = uuidv5( username, namespace_uid )
        console.log ( uid )

        if ( clients_info[ uid ] === undefined ){

            clients_info[ uid ] = {
                username: username
            }

        } else return false;

    }

}
