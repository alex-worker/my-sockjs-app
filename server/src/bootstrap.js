const Commander = require('./commander')
const HELLO = require('./commands/hello')
const TEXT = require('./commands/text')

function setup(Server){
    Commander.add('hello', HELLO)
    Commander.add('text', TEXT)
    Server.use( Commander.middleware() )
}

module.exports = {
    setup,
}
