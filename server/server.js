'use strict';

const sockjs = require('sockjs');

class Server {

    onConnection(conn){
        conn.on('data', function(message) {
            conn.write(message);
        })
    }

    install(http_server){

        this.sockjs = sockjs.createServer()
        this.sockjs.installHandlers(http_server, {prefix:'/chat'});
        this.sockjs.on('connection', this.onConnection )

    }

}

module.exports = Server
