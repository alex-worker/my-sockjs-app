'use strict';

const conf = require('../common/config')

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

http_server.listen(conf.port, conf.ip)
console.log(' [*] Listening on '+conf.ip+':'+conf.port)

const Server = require('./server')
Server.install( http_server, conf.bound )

http_server.on('request', function(req, res){
    console.log('request');
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;

    let cookies = parseRequestCookies( req )
    if ( cookies.userId === undefined ) {
      console.log(`Look at you, hacker - your IP address is ${ip} and your source port is ${port}.`);
      req.socket.destroy()
    }
  
  });

http_server.on('upgrade', function(req, res){
    console.log('upgrade')

    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;

    // console.log( res )
    let cookies = parseRequestCookies( req )
    if ( cookies.userId === undefined ) {
      console.log(`Look at you, hacker - your IP address is ${ip} and your source port is ${port}.`);
      req.socket.destroy()
      res.end()
    }
    else {
      Server.addUser( cookies.userId )
    }
    // req.socket.destroy()
    // res.end()
  })
