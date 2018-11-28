'use strict'

const uuidv5 = require('uuid/v5')
const namespace_uid = 'cce99b65-f057-49ae-b75c-1ebbd353bc8c'

class Users {

// clients_wait - клиенты ожидающие авторизации
// clients_info - подтвержденные клиенты

    constructor() {
        this.clients_wait = {}
        this.clients_info = {}
    }

    // add user by username
    addUser(username) {
        
            let uid = uuidv5( username, namespace_uid )
            if ( this.clients_wait[ uid ] != undefined ) return false;
    
            this.clients_wait[ uid ] = {
                username: username,
                sock_uid: false,
                auth: false
            }
    
            return uid;
        }

    getUser(uid) {
        return ( this.clients_info[ uid ] === undefined ) ? false:this.clients_info[ uid ]
    }

    authUser(username, sock_uid) {
        let uid = uuidv5( username, namespace_uid )
        // console.log( 'clients_wait' + this.clients_wait )

        if ( this.clients_wait[ uid ] === undefined ) return false

        this.clients_wait[ uid ].auth = true
        this.clients_wait[ uid ].sock_uid = sock_uid

        let json_copy = JSON.stringify( this.clients_wait[ uid ] )
        delete this.clients_wait[uid]

        this.clients_info[ sock_uid ] = JSON.parse( json_copy )
        
        // console.log( this.clients_info[ sock_uid ] )
        return true

    }

}

module.exports = Users
