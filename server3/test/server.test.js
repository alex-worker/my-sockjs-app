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
        
        client.onmessage = function() {
            resolve(client)
        }

    })
}

function send_promised_sockjs(client, mess){
    return new Promise(function(resolve, reject) {

        client.onerror = (err) => {
            // console.log('on error')
            reject(err)
        }
        client.onclose = (err) => {
            // console.log('on close')
            reject(err)
        }
        client.onopen = function() {
            // console.log('on open')
            resolve(client)
        }
        client.onmessage = function(mess_ret) {
            // console.log('on message', mess_ret )
            let ret = JSON.parse( mess_ret.data )
            resolve( ret )
        }

        client.send( mess )

    })
}

function get_promised_sockjs(client){
    return new Promise(function(resolve, reject) {

        client.onerror = (err) => {
            reject(err)
        }
        client.onclose = (err) => {
            reject(err)
        }
        client.onopen = function() {
            reject(err) // ибо нефиг
            // resolve(client)
        }
        client.onmessage = function(mess_ret) {
            // console.log('on message', mess_ret )
            let ret = JSON.parse( mess_ret.data )
            resolve( ret )
        }
    })
}


// функция создания нового клиента,
//  присоединенного к серверу и представившегося
const new_client_and_hello = async (name) => {

    let uid = Server.addUser( name ) // добавляем пользователя на сервер
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

    let client = await new_promised_sockjs()

    let send_mess = {
        type: 'hello',
        message: name
    }
    
    let resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))
    assert.equal( resp.type, 'hello')
    return client

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
// -----------------------------------------------------------------------------
// посылаем JSON неверного формата - должны получить сообщение об ошибке в JSON
// -----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------------
// пытаемся сказать ( type:text ) не представившись - должны получить обрубленное соединение
// ----------------------------------------------------------------------------------

    send_mess = {
        type: 'text',
        message: 'lold'
    }

    try {
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))
        assert.fail("Server must throw error!...")
    }
    catch( e ){ // должны выдать ошибку о закрытии соединения с сервером
        assert.equal(e.type, 'close')
    }
    
// ----------------------------------------------------------------------------------
// пытаемся представиться пользователем которого нет
// ----------------------------------------------------------------------------------
    send_mess = {
        type: 'hello',
        message: 'mr.Guest'
    }

    client = await new_promised_sockjs()
    try {
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))
        assert.fail("Server must throw error to mr.Guest")
    }
    catch( e ){ // должны выдать ошибку о закрытии соединения с сервером
        assert.equal(e.type, 'close')
    }
    await client.close()

// ----------------------------------------------------------------------------------
// пытаемся представиться пользователем который есть и сказать privet
// ----------------------------------------------------------------------------------
    send_mess = {
        type: 'hello',
        message: common_name
    }

    let send_mess2 = {
        type: 'text',
        message: 'privet!'
    }

    client = await new_promised_sockjs()
    try {
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess )) // сервер возвращает hello
        assert.equal(resp.type, 'hello' )
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess2 ))
    }
    catch( e ){
        assert.fail("Server must don't throw error to common_name!")
    }

    // должны получить наше сообщение так как broadcast
    assert.equal(resp.type, 'message' )
    assert.equal(resp.message, send_mess2.message )

    // console.log( resp )
    await client.close()

}

const test_normal_use = async () => {

// ----------------------------------------------------------------------------------
// добавляем пользователя и соединяемся с сервером
// ----------------------------------------------------------------------------------

    let client = await new_client_and_hello( common_name )
    let client2 = await new_client_and_hello( faker.name.firstName() )

    let send_mess = {
        type: 'text',
        message: 'good news from 1!'
    }

// делаем промис на получение сообщения
    let prom2 = get_promised_sockjs(client2)

    let resp = await send_promised_sockjs(client, JSON.stringify( send_mess ))

    prom2.then( resp => {
        assert.equal( resp.type, 'message')
        assert.equal( resp.message, send_mess.message)
    }).catch( err => {
        assert.fail("Exception error from get promise")
    })

    let prom = get_promised_sockjs(client)
    prom2 = get_promised_sockjs(client2)

    let client3 = await new_client_and_hello( faker.name.firstName() )

    await client.close()
    await client2.close()
    await client3.close()

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
