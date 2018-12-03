'use strict'
const assert = require('assert')
const faker = require('faker')
const connect = require('connect');
const conf = require('../../common/config')

const http = require('http')
const supertest = require('supertest')
const Server = require('../server')

const SockJS = require('sockjs-client')

const connect_url = conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound

let common_name
let app // for app.use( ... )
let request // for [await] request( ... ).

// let client // for chat-client request

function new_promised_sockjs(){
    return new Promise(function(resolve, reject) {

        let client = new SockJS( connect_url )

        client.onerror = (err) => { 
            reject(err)
        }

        client.onclose = (err) => {
            reject(err)
        }

        client.onopen = function() {
            resolve(client)
        }
        
        // client.onmessage = function() {
        //     resolve(client)
        // }

    })
}

function send_promised_sockjs(client, mess){
    return new Promise(function(resolve, reject) {

        client.onerror = (err) => {
            console.log('on error')
            reject(err)
        }
        client.onclose = (err) => {
            console.log('on close')
            reject(err)
        }
        client.onopen = function() {
            console.log('on open')
            resolve(client)
        }
        client.onmessage = function(mess_ret) {
            console.log('on message', mess_ret )
            let ret = JSON.parse( mess_ret.data )
            resolve( ret )
        }

        client.send( mess )

    })
}

const test_illegal_use = async () => {

    let uid = Server.addUser( common_name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

// ------------------------------------------------------------------------
// посылаем просто lol - должны получить обрубленное соединение
// ------------------------------------------------------------------------
    let client = await new_promised_sockjs()
    
    let send_mess = 'lol'
    let resp

    try {
        resp = await send_promised_sockjs(client, send_mess)
        assert.fail("Server don't close by exception!")
    }
    catch( e ){ // должны выдать ошибку о закрытии соединения с сервером
        assert.equal(e.type, 'close')
    }
// ------------------------------------------------------------------------
// посылаем JSON неверного формата - должны получить сообщение об ошибке в JSON
// ------------------------------------------------------------------------
    send_mess = {
        type: 'texkkt',
        message: 'lold'
    }

    client = await new_promised_sockjs()
    try {
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))
    }
    catch( e ){
        assert.fail("Server exception done...")
    }
    assert.equal( resp.type, 'error')
    assert.equal( resp.message, 'data.type should be equal to one of the allowed values')

// ------------------------------------------------------------------------
// пытаемся сказать ( type:text ) не представившись - должны получить ошибку сервера
// ------------------------------------------------------------------------

    send_mess = {
        type: 'hello',
        message: 'lold'
    }

    try {
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))
    }
    catch( e ){
        assert.fail("Server exception done 2...")
    }
    console.log( resp )
    // assert.equal( resp.type, 'error')
    // assert.equal( resp.message, 'data.type should be equal to one of the allowed values')

    await client.close()
    
}

const test_normal_use = async () => {

    let uid = Server.addUser( common_name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

    return request
        .get('/api/v1/laps')
        .set('Accept', 'application/json')
        .expect("Content-type",'text/plain')
        .expect(200)
    }

describe("Server", function() {

    let server // server.close() after each test

    before( function() {
        // делаем имя одинаковое для всех тестов для проверки
        // что данные не сохраняются от предыдущего теста
        common_name = faker.name.firstName() 
    })

    beforeEach( (done) => {
        app = connect()
        server = http.createServer(app).listen(conf.port, conf.ip)
        Server.install( server, conf.bound  )

        request = supertest(server)

        app.use( (req, res, next) => {
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.write('Look at you, hacker!')
            res.end()
            next()
        })

        // const connect_url = conf.protocol+"://"+conf.ip+'::'+conf.port+'/'+conf.bound
        // client =  new SockJS( connect_url )

        done()
    })
    
    afterEach(async function(){
        await server.close()
    })

    it('test http server', async () => {
    
        return request
        .get('/api/v1/laps/85299')
        .set('Accept', 'application/json')
        .expect("Content-type",'text/plain')
        .expect(200)

    })

    it('test normal use', test_normal_use )
    it('test illegal use', test_illegal_use )

})
