'use strict'

const assert = require('assert')
const faker = require('faker')
const UsersClass = require('../users')

const test_normal_use = () => {

    let users = new UsersClass()    

    let name = faker.name.firstName()
    let sock_uid = faker.random.uuid()

    let uid = users.addUser( name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

    let res = users.addUser( name )
    assert.equal( res, false );  // такой уже есть!

    res = users.getUser( uid )
    assert.equal( res, false );  // неавторизованных не выдаем
    res = users.getUser( sock_uid )
    assert.equal( res, false );  // нет такого uid

    users.authUser( name, sock_uid )
    res = users.getUser( sock_uid )
    assert.equal( res.username, name );  // это наш!

}

const users_test = () => {
    it("normal use", test_normal_use )
}

describe("users", users_test )
