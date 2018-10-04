'use strict';

// const Koa = require('koa');
// const Router = require('koa-router');

const http = require('http');
const fs = require('fs');
const path = require('path');

const sockjs = require('sockjs');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    return next().then(() => {
            const filePath = __dirname + '/client/index.html';
            ctx.response.type = path.extname(filePath);
            ctx.response.body = fs.createReadStream(filePath);
          });
    });

app
    .use(router.routes())
    .use(router.allowedMethods());

app.on('error', err => {
    console.error('server error', err)
  });

// app.use(function(ctx, next) {
//   return next().then(() => {
//     const filePath = __dirname + '/index.html';
//     ctx.response.type = path.extname(filePath);
//     ctx.response.body = fs.createReadStream(filePath);
//   });
// });

const server = http.createServer(app.callback());
server.listen(9999, '0.0.0.0');
console.log(' [*] Listening on 0.0.0.0:9999');

const sockjs_echo = sockjs.createServer()
sockjs_echo.installHandlers(server, {prefix:'/chat'});

sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
      conn.write(message);
    });
  });


// sockjs_echo.installHandlers( server );
// sockjs_echo.attach(server);
// server.listen(9999, '0.0.0.0');