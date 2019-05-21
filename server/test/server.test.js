'use strict'
const assert = require('assert')
const faker = require('faker')
const connect = require('connect');
const conf = require('../../common/config')

const http = require('http')
const supertest = require('supertest')
const Server = require('../src/server')

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
            console.log(' error! ')
            reject(err)
        }
        client.onclose = (err) => {
            reject(err)
        }
        client.onopen = function() {
            reject(err) // ибо нефиг, клиент уже есть
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
    assert.equal( resp.type, 'history')
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
        resp = await send_promised_sockjs(client, JSON.stringify( send_mess )) // сервер возвращает history
        assert.equal(resp.type, 'history' )
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

    let client, client2, client3
    let prom, prom2
    let send_mess, send_mess2
    let resp

// ----------------------------------------------------------------------------------
// добавляем пользователя и соединяемся с сервером
// должны были получить сообщение о приходе нового пользователя
// ----------------------------------------------------------------------------------

    client = await new_client_and_hello( common_name )
    prom = get_promised_sockjs(client)
    let name2 = faker.name.firstName()
    client2 = await new_client_and_hello( name2 )

    resp = await prom
    assert.equal( resp.type, 'newUser')
    assert.equal( resp.message, name2 )

    send_mess = {
        type: 'text',
        message: faker.random.words()
    }

// ----------------------------------------------------------------------------------
// отправка пользователем сообщения в чат
// доугой пользователь должен получить его из чата
// ----------------------------------------------------------------------------------

    prom2 = get_promised_sockjs(client2)
    await send_promised_sockjs(client, JSON.stringify( send_mess ))

    resp = await prom2 // чудо! пришло сообщение клиенту2 отправленное в чат от клиента1
    assert.equal( resp.type, 'message')
    assert.equal( resp.message, send_mess.message)

    send_mess2 = {
        type: 'text',
        message: faker.random.words()
    }

    await send_promised_sockjs(client2, JSON.stringify( send_mess2 ))

// ----------------------------------------------------------------------------------
// выход пользователя
// оставшийся пользователь должен получить извещение о выходе 
// ----------------------------------------------------------------------------------

    prom = get_promised_sockjs(client)
    await client2.close()
    resp = await prom
    assert.equal( resp.type, 'userLeft')
    assert.equal( resp.message, name2)

// ----------------------------------------------------------------------------------
// вход нового пользователя
// вошедший пользователь должен получить историю предыдущих сообщений
// ----------------------------------------------------------------------------------

    let name3 = faker.name.firstName()
    let uid3 = Server.addUser( name3 ) // добавляем пользователя на сервер
    client3 = await new_promised_sockjs()

    let send_mess3 = {
        type: 'hello',
        message: name3
    }
    
    let etalon = {
        type: 'history',
        message: [ 
            {
                name: common_name,
                message: send_mess.message
            }, 
            {
                name: name2,
                message: send_mess2.message
            }
        ],
        id: uid3
    }

    resp = await send_promised_sockjs(client, JSON.stringify( send_mess3 ))
    etalon.id = resp.id // id с сервера пришло

    assert.equal( JSON.stringify( etalon ),  JSON.stringify( resp ) )

    await client.close()
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
        Server.install( server, conf.bound )

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

    // it('test normal use', test_normal_use )
    // it('test illegal use', test_illegal_use )

})
