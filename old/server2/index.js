'use strict';

const conf = require('../common/config')

const sockjs = require('sockjs');

const sockjs_opts = {
    prefix: conf.bound
  };

const sockjs_echo = sockjs.createServer(sockjs_opts)

let onConnection = (conn) => {

    conn.on('data', function(message) {
        console.log( message )
        conn.write(message)
    })

    // console.log( conn._session.recv.ws._stream )
    // clients[conn.id] = conn
    // broadcast({ type: 'newUser' }, conn.id)
    // whisper(conn.id, { type: 'history', message: buffer, id: conn.id })
    // conn.on('data', (data) => { onData(conn.id, data )} )
	// conn.on('close', () => { onClose(conn.id )} );
}

const http = require('http')
// const Koa = require('koa')
// const app = new Koa()

// app.use(async ctx => {
//     console.log( 'redirect' )
//     ctx.set('Access-Control-Allow-Origin', 'http://localhost:9999')
//     ctx.set('Access-Control-Allow-Credentials', 'true')
//     ctx.status = 301
//     ctx.redirect('/'+conf.bound)
//     ctx.body = 'Redirecting to shopping cart'
//   })

// const http_server = http.createServer( app.callback() )
const http_server = http.createServer(  )
sockjs_echo.installHandlers(http_server, {prefix:'/'+conf.bound})
sockjs_echo.on('connection', onConnection )

http_server.listen(conf.port, conf.ip)
console.log(' [*] Listening on '+conf.ip+':'+conf.port)

// http_server.on('request', function(req, res){
//     console.log('request')
//     console.log( req.headers )
// })

http_server.on('upgrade', function(req, res){
    console.log('upgrade')
    console.log( req.headers )
})

http_server.on('clientError', function(req, res){
    console.log('clientError')
})

  