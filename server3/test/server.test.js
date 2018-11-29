'use strict'
const assert = require('assert')
const faker = require('faker')
const connect = require('connect');
const conf = require('../../common/config')

const http = require('http')
const supertest = require('supertest')
const Server = require('../server')

let name
// let http_server
// let app

// const test_illegal_use = async (done) => {
    
//     // let uid = Server.addUser( name )
//     // assert.notEqual( uid, false )
//     // assert.notEqual( uid, undefined )
//     // assert.notEqual( uid, null )
//     http_server = http.createServer()

//     request(http_server)
//     .get('/')
//     .expect(200, done);

//     // let client_http = http.request({
//     //         host: conf.ip,
//     //         port: conf.port,
//     //         path: '/'
//     //       }
//     // )

// }

// const test_normal_use = () => {
//     let uid = Server.addUser( name )
//     assert.notEqual( uid, false )
//     assert.notEqual( uid, undefined )
//     assert.notEqual( uid, null )
// }

// const server_test = async () => {

//     before( function() {
//         name = faker.name.firstName()
//     })
//     beforeEach( async () => {
//         // http_server = http.Server()
//         // await http_server.listen(conf.port, conf.ip)
//         // Server.install( http_server, conf.bound  )
//     })
//     afterEach( async () => {
//         await http_server.close()
//     })

//     describe("server normal use", async function() {
//         // it( 'test normal use', test_normal_use )
//     })
//     describe("server illegal use", async function() {
//         it( 'test illegal use', test_illegal_use )
//     } )

// }

// describe("Server", server_test )

// let app
// let server
// let request

// app = http.createServer( (req, res) => {
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         res.write('Hello World!');
//         res.end();
//         }
// )

// server = app.listen(conf.port)
// request = supertest(app)


describe("Server", function() {

    // let http_server
    let app
    let server
    let request

    before(function(done){
        app = connect()

        // http_server = http.createServer( (req, res) => {
        //     res.writeHead(200, {'Content-Type': 'text/plain'});
        //     res.write('Hello World!');
        //     res.end();
        //     })

        server = http.createServer(app).listen(conf.port, conf.ip)
        // server = http_server.listen(conf.port, conf.ip)
    //     // request = supertest.agent('http://'+conf.ip+':'+conf.port)
        request = supertest(server)
        done()
      })
    
    after(async function(){
        // await request.close()
        await server.close()
        // console.log('after')
      })

    // it.only("should return home page",function(){
    //     return request
    // })
    
    it('test server', async () => {

        // server.use(async function (ctx) {
        //     const filename = path.join(__dirname, 'fixtures/sample.html')
        //     const html = fs.readFileSync(filename, {encoding: 'utf8'})
        //     ctx.body = await ctx.pdf.generateFromHtml(html)
        // })

        // return request.get('/api/v1/laps/85299')
        // .expect(200, { data: {} })

        return request
        .get('/api/v1/laps/85299')
        // .expect("Content-type",/json/)
        .expect(200)
        // .end(function(err,res){
        //     console.log( res )
        //     done()
        // })

    })

})

        // done()

        // .get('/api/v1/laps/85299')
        // .end( (err, res) => {
        //     console.log( JSON.stringify(res.body) )
        //     console.log( JSON.stringify(err.body) )
        //     done()
        // })
        // .then( res => {
        //     console.log( JSON.stringify(res.body) )
        //     done()
        // })
        // .catch(err => {
        // //     // err.message, err.response
        //     console.log( err )
        //     done()
        //  });

    // })


    // afterEach( async function(done) {
    //     http_server.close()
    //     done()
    // })

    // it('test server', async (done) => {
    //     http_server = http.createServer()
    //     http_server.listen(done)

    //     request(http_server)
    //     .get('/')
    //     .expect(200, () => {
    //         http_server.close()
    //         done()
    //       })
    //     // return done();
    // })
// })