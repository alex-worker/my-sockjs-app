let commands = {}

function add(name,func){
    console.log('add command '+name)
    commands[name] = func
}

function process( ctx ){
    // console.log('COMMANDER!')
    let command = ctx.data.type
    if ( command === undefined ) {
        ctx.api.drop(ctx.id) // нечего присылать хрень
        return
    }
    console.log( 'Command:' + command )
    // ctx.api.drop(ctx.id)
}

module.exports = {
    add,
    middleware: function() {
        return process
    }
}