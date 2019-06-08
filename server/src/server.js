'use strict';

const sockjs = require('sockjs')
const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true,
	verbose:   true,
})
// const json_schema= require('../../common/schema/webchat-srv.json')
// const validate = ajv.compile(json_schema)

const Users = require('./users')
let users

let clients = {}
let buffer = []

let middleware = []

function use(func){
    middleware.push(func)
}

// все надо переделать - чтобы в Server новый сервер не создавался, лол!
// а может это все на голанг переписать...


class Server {

    authUser (name, id) {
        return users.authUser( name, id )
    }

    getUser(id){
        return users.getUser(id)
    }

    say(id, message){
        message = message.substr(0, 128)
        if ( buffer.length > 515 ) buffer.shift()
        let say_buffer = {
            name: users.getUser( id ).username,
            message: message
        }
        users.getUser( id ).username
        buffer.push(say_buffer)

        this.broadcast({ type: 'message', message: message, id: id })
    }

    sendError(id, error){
        this.whisper( id, { type: 'history', message: buffer, id: id })
    }
    sendHistory (id) {
        this.whisper( id, { type: 'history', message: buffer, id: id })
    }

    sendNewUser(name, id) {
        this.broadcast({ type: 'newUser', message: name }, id)
    }

    sendUserLeft(name) { // потому что id уже нет и он удален из списка
        this.broadcast({ type: 'userLeft', message: name })
    }

    drop (id) {
        if ( !clients[id] ) return
        clients[id].close()
        delete clients[id]
    }
    
    whisper (id, message) {
        if ( !clients[id] ) return
        clients[id].write( JSON.stringify(message) )
    }
    
    broadcast (message, exclude) {
        for ( var i in clients ) {
            if ( i != exclude ) clients[i].write( JSON.stringify(message) )
        }
    }

}

const myServer = new Server()

let onData = (id,data) => {

    console.log("===SERVER: ", id)
    console.log("===DATA:", data)
    try {
        data = JSON.parse(data)
    }
    catch(err){
        myServer.drop(id) // нечего присылать хрень
        return
    }

    let ctx = {
        id: id,
        data: data,
        api: myServer
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
    let exit_username = users.getUser( id ).username
    delete clients[id]
    myServer.sendUserLeft(exit_username)
}

let onConnection = (conn) => {
    clients[conn.id] = conn
    conn.on('data', (data) => { onData(conn.id, data )} )
	conn.on('close', () => { onClose(conn.id )} )
}

module.exports = {

    use,
    install: function(http_server, bound) {

        users = new Users()
        clients = {}
        buffer = []

        let my_sockjs = sockjs.createServer(
            
            {
                log: (severity, message) => {
                    console.log( '---- debug: ----')
                    console.log( severity )
                    console.log( message )
                }
            }
        )

        my_sockjs.installHandlers(http_server, {prefix:'/'+bound})
        my_sockjs.on('connection', onConnection )
        // my_sockjs.on('upgrade', onUpgrade )

    },

    addUser: (username) => {
        return users.addUser( username )
    }

}
