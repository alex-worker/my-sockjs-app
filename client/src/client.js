import SockJS from 'sockjs-client';

export default class Client {
 
    // vars: 
    // conn_http_url - connected url
    // callback - callback function
    // sock - SockJS class
    // type: close/open/message/error

    getRetJSON(){
        return {
            'type':'message'
        }
    }

    constructor( connect_url, callback ){
        console.log( 'set connect '+ connect_url )
        this.connect_url = connect_url
        this.callback_function = callback
    }

    connect(){
        console.log( 'try connect '+ this.connect_url )
        this.sock = new SockJS( this.connect_url )
        this.sock.onopen = this.onOpen.bind(this)
        this.sock.onmessage = this.onMessage.bind(this)
        this.sock.onclose = this.onClose.bind(this)
        this.sock.onerror = this.onError.bind(this)
    }
    
    onOpen(){
        let ret = this.getRetJSON();
        ret.type = 'open';
        this.callback_function( ret )
    }

    onClose(){
        let ret = this.getRetJSON();
        ret.type = 'close';
        this.callback_function( ret )
    }

    onMessage(mess){
        let ret = this.getRetJSON();
        ret.message = mess
        this.callback_function( ret )
    }

    onError(){
        let ret = this.getRetJSON();
        ret.type = 'error';
        this.callback_function( ret )
    }

    // connect( conn_http_server, bound  ){
    //     console.log( 'try connect '+ conn_http_server + '/' + bound )

//         let appendMessage = ( nickname, message ) => {
//             console.log( nickname + ':' + message )
//         }
    
        // let sock = new SockJS('http://127.0.0.1:9999/chat')

//         sock.onopen = function () {
//             appendMessage('system', 'Connected! Welcome to SockJS chat demo.')
//             sock.send(JSON.stringify({
//                 type: 'text',
//                 message: 'hello!'
//             }));
        // }

//         sock.onmessage = function (e) {
//             var data = JSON.parse(e.data)
//             console.log( data )
//         }

//         sock.onclose = function(){
//             appendMessage('system', 'Server disconnected!')
//         }
        
//         sock.onerror = function(e){
//             console.error(e)
//             // appendMessage('system', 'Error!')
//         }
        
    // }

}

// let onOpen = () => {
//     console.log('open')
// }

// module.exports = {

//     // connect: function( conn_http_server, bound ) {
//         // let sock = new SockJS( conn_http_server+'/'+bound  );
//         // return sock;
//     // }
//     install: function(http_server, bound) {
//         let sock = new SockJS( http_server+'/'+bound  );
//         sock.on('open', onOpen)
//     }

// }