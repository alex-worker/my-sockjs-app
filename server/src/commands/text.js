// if ( data.type == 'text' ) {

//     if ( users.getUser(id) === false ) { // пользователь не представился
//         drop(id)
//         return
//     }

//     data.message = data.message.substr(0, 128)
//     if ( buffer.length > 515 ) buffer.shift()
//     let say_buffer = {
//         name: users.getUser( id ).username,
//         message: data.message
//     }
//         // users.getUser( id ).username

//     buffer.push(say_buffer)

//     broadcast({ type: 'message', message: data.message, id: id })
//     return
// }

function process(id, data){

    // if ( users.getUser(id) === false ) { // пользователь не представился
    //     drop(id)
    //     return
    // }

    console.log('==text==')
    console.log(id)
    console.log(data)
}

module.exports = {
    process,
}
