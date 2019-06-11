let commands = {}

function add(name,func){
    // console.log('add command '+name)
    commands[name] = func
}

function process( ctx ){

    let command = ctx.data.type
    if ( command === undefined ) {
        ctx.api.sendError(ctx.id, "param type is undefined")
        ctx.api.drop(ctx.id) // нечего присылать хрень
        return
    }

    console.log( 'Command:' + command )
    
    if ( commands[command] === undefined ) {
        ctx.api.sendError(ctx.id, "unsupported command "+command)
        ctx.api.drop(ctx.id) // нечего присылать хрень
        return
    }

    if( command!=='hello') // если пользователь не представился а что-то лепечет
    if ( !ctx.api.getUser(ctx.id) ) {
        ctx.api.sendError(ctx.id, "don't say hello")
        ctx.api.drop(ctx.id)
        return
    }

    commands[command](ctx)

}

module.exports = {
    add,
    middleware: function() {
        return process
    }
}