'use strict';

const sockjs = require('sockjs')
const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true,
	verbose:   true,
})
const json_schema= require('../common/schema/webchat-srv.json')
const validate = ajv.compile(json_schema)

const Users = require('./users')

let clients = {}
let buffer = []

function drop (id) {
    if ( !clients[id] ) return
    console.log( ' drop! ' + id)
    clients[id].close()
    delete clients[id]
}

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
        // console.log('Valid!');
    }
    else {
        console.log( data );
        console.log('Invalid: ' + ajv.errorsText(validate.errors));
        whisper(id, { type: 'error', message: ajv.errorsText(validate.errors), id: id });
        return
    }

    if ( data.type == 'text' ) {

        if ( Users.getUser(id) === undefined ) { // пользователь не представился
            drop(id)
            return
        }

        data.message = data.message.substr(0, 128)

        if ( buffer.length > 515 ) buffer.shift()
        buffer.push(data.message)

        broadcast({ type: 'message', message: data.message, id: id })
        return
    }

    if ( data.type == 'hello' ) {
        console.log( 'client ' + id + ' say hello: ' + data.message )
        if ( !Users.authUser( data.message, id ) ) {
            drop(id)
            return
        }
    }

}

let onClose = (id) => {
    console.log( 'client disconnect:' + id)
    delete clients[id]
    broadcast({ type: 'userLeft' })
}

let onConnection = (conn) => {
    // console.log( conn.headers )
    console.log( 'client connect:' + conn.id)
    clients[conn.id] = conn
    // broadcast({ type: 'newUser' }, conn.id)
    // whisper(conn.id, { type: 'history', message: buffer, id: conn.id })
    conn.on('data', (data) => { onData(conn.id, data )} )
	conn.on('close', () => { onClose(conn.id )} )
}

module.exports = {

    install: function(http_server, bound) {

        let my_sockjs = sockjs.createServer( 
            // {
            //     log: (severity, message) => {
            //         console.log( '---- debug: ----')
            //         console.log( severity )
            //         console.log( message )
            //     }
            // }
        )

        my_sockjs.installHandlers(http_server, {prefix:'/'+bound})
        my_sockjs.on('connection', onConnection )
        // my_sockjs.on('upgrade', onUpgrade )

    },

    addUser: (username) => {
        return Users.addUser( username )
    }

    // authUser: (username) => {
    //     return Users.authUser( username )
    // }

}
