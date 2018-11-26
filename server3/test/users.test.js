'use strict'

const assert = require('assert')
const faker = require('faker')

const test_normal_use = () => {

    let Users = require('../users')

    let name = faker.name.firstName()
    let sock_uid = faker.random.uuid()

    let uid = Users.addUser( name )
    assert.notEqual( uid, false )
    assert.notEqual( uid, undefined )
    assert.notEqual( uid, null )

    let res = Users.addUser( name )
    assert.equal( res, false );  // такой уже есть!

    res = Users.getUser( uid )
    assert.equal( res, false );  // неавторизованных не выдаем
    res = Users.getUser( sock_uid )
    assert.equal( res, false );  // нет такого uid

    Users.authUser( name, sock_uid )
    res = Users.getUser( sock_uid )
    assert.equal( res.username, name );  // это наш!

}

const users_test = () => {
    it("normal use", test_normal_use )
}

describe("users", users_test )
