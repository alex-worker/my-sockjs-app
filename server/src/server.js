'use strict';

const sockjs = require('sockjs')
const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true,
	verbose:   true,
})
const json_schema= require('../../common/schema/webchat-srv.json')
const validate = ajv.compile(json_schema)

const Users = require('./users')
let users

let clients = {}
let buffer = []

let middleware = []

function use(func){
    middleware.push(func)
}

/**
 * Drop connection
 * @param {id} - connection id
 */
function drop (id) {
    if ( !clients[id] ) return
    // console.log( ' drop! ' + id)
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
        drop(id) // нечего присылать хрень
        return
    }

    // let command = data.type
    // if ( command === undefined ) {
    //     drop(id) // нечего присылать хрень
    //     return
    // }

    // console.log( 'command:' + command )
    // console.log( commands )

    // if ( commands[command] === undefined ) {
    //     console.log( 'UNSUPPORTED: ' + id + ' : ' + JSON.stringify(data) )
    //     return
    // }

    let ctx = {
        id: id,
        data: data,
    }

    middleware.forEach(el => {
        el(ctx)
    })

    // var valid = validate(data)
    // if (valid) {
    //     // console.log('Valid!');
    // }
    // else {
    //     // console.log( data );
    //     // console.log('Invalid: ' + ajv.errorsText(validate.errors));
    //     whisper(id, {
    //             type: 'error',
    //             message: ajv.errorsText(validate.errors), 
    //             id: id
    //         });
    //     return
    // }

}

let onClose = (id) => {
    // console.log( 'client disconnect:' + id)
    let exit_username = users.getUser( id ).username
    delete clients[id]
    broadcast({ type: 'userLeft', message: exit_username })
}

let onConnection = (conn) => {
    // console.log( conn.headers )
    // console.log( 'client connect:' + conn.id)
    clients[conn.id] = conn
    // broadcast({ type: 'newUser' }, conn.id)
    // whisper(conn.id, { type: 'history', message: buffer, id: conn.id })
    conn.on('data', (data) => { onData(conn.id, data )} )
	conn.on('close', () => { onClose(conn.id )} )
}

module.exports = {

    use,
    install: function(http_server, bound) {

        users = new Users()
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
        return users.addUser( username )
    }

}
