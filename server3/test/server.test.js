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

function promise_sockjs(){
    return new Promise(function(resolve, reject) {

        // console.log( connect_url )
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

const test_illegal_use = async () => {

    let uid = Server.addUser( common_name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

    let client = await promise_sockjs()
    await client.close()
    // await promise_sockjs()

    // return request
    // .get('/api/v1')
    // .set('Accept', 'application/json')
    // .expect("Content-type",'text/plain')
    // .expect(200)
    
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
