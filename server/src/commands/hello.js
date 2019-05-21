
// if ( data.type == 'hello' ) {
//     // console.log( 'client ' + id + ' say hello: ' + data.message )
//     if ( !users.authUser( data.message, id ) ) {
//         drop(id)
//         return
//     }
//     // иначе всем говорим что зашел новый пользователь
//     broadcast({ type: 'newUser', message: data.message }, id)
//     // а ему отправляем историю сообщений
//     whisper( id, { type: 'history', message: buffer, id: id })

// }

function process(id, data){

    // if ( !users.authUser( data.message, id ) ) {
    //     drop(id)
    //     return
    // }

    console.log('==HELLO==')
    console.log(id)
    console.log(data)
}

module.exports = {
    process
}