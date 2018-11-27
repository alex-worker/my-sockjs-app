'use strict'
const assert = require('assert')
const faker = require('faker')

const http = require('http')
const conf = require('../../common/config')

const test_normal_use = () => {
    // const http_server = http.createServer()
    // http_server.listen(conf.port, conf.ip)
    // return new Promise(resolve => {
                // http_server.close(resolve)
    // })
    // http_server.off('logout')
    // let sockets = {}, nextSocketId = 0;
    // http_server.on('connection', function (socket) {
    //     let socketId = nextSocketId++
    //     sockets[socketId] = socket
        
    //     // Remove the socket when it closes
    //     socket.on('close', function () {
    //         console.log('socket', socketId, 'closed');
    //         delete sockets[socketId];
    //     });
    //     return new Promise(resolve => {
    //         server.close(resolve)
    //       }
    // })

}

const server_test = () => {
    let http_server

    beforeEach( async () => {
        http_server = http.createServer()
        http_server.listen(conf.port, conf.ip)
    })
    afterEach( async () => {
        await http_server.close()
    })
    it("normal use", test_normal_use )
}

describe("server", server_test )
