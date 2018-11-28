'use strict'
const assert = require('assert')
const faker = require('faker')

const conf = require('../../common/config')

const http = require('http')

let name
let http_server
let Server

const test_illegal_use = () => {
    let uid = Server.addUser( name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )
    // console.log( res )
}

const test_normal_use = () => {
    let uid = Server.addUser( name )
    console.log( Server.buffer )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )
}

const server_test = async () => {

    before( function() {
        name = faker.name.firstName()
    })
    beforeEach( async () => {
        http_server = http.createServer()
        http_server.listen(conf.port, conf.ip)
        Server = require('../server')
        Server.install( http_server, conf.bound  )
    })
    afterEach( async () => {
        await http_server.close()
    })

    describe("server normal use", async function() {
        it( 'test normal use', test_normal_use )
    })
    describe("server illegal use", async function() {
        it( 'test illegal use', test_illegal_use )
    } )

}

describe("server", server_test )
