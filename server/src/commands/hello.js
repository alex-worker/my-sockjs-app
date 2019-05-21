function process(ctx){

// если не получилось авторизовать пользователя - дропаем
    if ( !ctx.api.authUser( ctx.data.message, ctx.id ) ) {
        drop(ctx.id)
        return
    }

// иначе всем говорим что зашел новый пользователь
    ctx.api.sendNewUser(ctx.id)
// а ему отправляем историю сообщений
    ctx.api.sendHistory(ctx.id)

}

module.exports = process