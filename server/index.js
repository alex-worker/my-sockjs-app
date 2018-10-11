'use strict';

const conf = require('./config')

const http = require('http')
const http_server = http.createServer()
http_server.listen(conf.port, conf.ip)
console.log(' [*] Listening on '+conf.ip+':'+conf.port)

const Server = require('./server')
Server.install( http_server, conf.bound )
