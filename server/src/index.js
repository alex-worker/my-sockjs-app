'use strict';

const config = require('../../common/config')

const http = require('http')
const http_server = http.createServer()

function parseRequestCookies (request) {
  var list = {},

  rc = request.headers.cookie
  if ( rc === undefined ) return list;

  rc = rc.split(';')
  rc.forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

http_server.listen(config.port, config.ip)
console.log(' [*] Listening on '+config.ip+':'+config.port)

const Server = require('./server')

const bootstrap = require('/bootstrap')
// const Commander = require('./commander')
// const HELLO = require('./commands/hello')
// const TEXT = require('./commands/text')
// Commander.add('hello', HELLO)
// Commander.add('text', TEXT)
// Server.use( Commander.middleware() )

bootstrap.setup(Server)
Server.install( http_server, config.bound )

http_server.on('upgrade', function(req, res){
  console.log('upgrade')

  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;

  let cookies = parseRequestCookies(req)
  if ( cookies.userId === undefined ) {
    console.log(`Look at you, hacker - your IP address is ${ip} and your source port is ${port}.`);
    req.socket.destroy()
    res.end()
  }
  else {
    Server.addUser( cookies.userId )
  }
})
