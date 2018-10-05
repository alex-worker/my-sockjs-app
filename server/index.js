'use strict';

const http = require('http')
const http_server = http.createServer()
http_server.listen(9999, '0.0.0.0')
console.log(' [*] Listening on 0.0.0.0:9999')

const Server = require('./server')
Server.install( http_server )
