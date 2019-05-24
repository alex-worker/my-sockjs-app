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
        console.log( 'UNSUPPORTED: ' + command )
        ctx.api.drop(ctx.id) // нечего присылать хрень
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