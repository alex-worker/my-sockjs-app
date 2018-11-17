'use strict';

const conf = require('../common/config')

const http = require('http')
const http_server = http.createServer( 
(req, res) => {
    console.log('default request');
    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('X-Foo', 'bar');
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end('ok');
  }

)

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
//     // console.log( req.headers )
    console.log( parseRequestCookies( req )  )
//     // res.read()
//     // console.log(JSON.stringify(res.headers));
//     // res.end();
//     // res.addTrailers({'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667'});
    // res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
//     // res.end();
  });


// http_server.on('connection', function(req){
//     console.log( 'connection' )
//     console.log( req )
// })

http_server.on('upgrade', function(req, res){
    // console.log('upgrade');
    // console.log( res )
    console.log( req.headers.cookie )
    // console.log( head )
    // console.log(JSON.stringify(res));
    // res.end()
    // res.pipe(res)
  })
