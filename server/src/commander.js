let commands = {}

function add(name,func){
    console.log('add command '+name)
    commands[name] = func
}

function process( ctx ){
    console.log('COMMANDER!')
}

module.exports = {
    add,
    middleware: function() {
        return process
    }
}