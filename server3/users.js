'use strict';

const uuidv5 = require('uuid/v5')
const namespace_uid = 'cce99b65-f057-49ae-b75c-1ebbd353bc8c'

// клиенты ожидающие авторизации
let clients_wait = {}

// подтвержденные клиенты
let clients_info = {}

module.exports = {

    // delUser: function(uid){
    //     if (clients_info[ uid ] != undefined) delete clients_info[uid]
    //     if (clients_wait[ uid ] != undefined) delete clients_wait[uid]
    // },

    getUser: function(uid) {
        return ( clients_info[ uid ] === undefined ) ? false:clients_info[ uid ]
    },

    authUser: function(username, sock_uid) {
        let uid = uuidv5( username, namespace_uid )
        if ( clients_wait[ uid ] === undefined ) return false

        clients_wait[ uid ].auth = true
        clients_wait[ uid ].sock_uid = sock_uid

        let json_copy = JSON.stringify( clients_wait[ uid ] )
        delete clients_wait[uid]

        clients_info[ sock_uid ] = JSON.parse( json_copy )
        
        // console.log( clients_info[ sock_uid ] )
        return true

    },

    // add user by username
    addUser: function(username) {
        
        let uid = uuidv5( username, namespace_uid )

        if ( clients_wait[ uid ] != undefined ) return false;

        clients_wait[ uid ] = {
            username: username,
            sock_uid: false,
            auth: false
        }

        return uid;

    }

}