import SockJS from 'sockjs-client';

export default class Client {
 
    // vars: 
    // conn_http_url - connected url
    // callback - callback function
    // sock - SockJS class

    // callback json type: close/open/message/error

    _getRetJSON(type_mess='message'){
        return {
            'type':type_mess
        }
    }

    say( mess ){
        console.log( 'try say mess:' + mess)
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
        let ret = this._getRetJSON('open');
        this.callback_function( ret )
    }

    onClose(){
        let ret = this._getRetJSON('close');
        this.callback_function( ret )
    }

    onMessage(mess){
        let ret = this._getRetJSON();
        ret.message = mess.data
        ret.timestamp = mess.timeStamp
        this.callback_function( ret )
    }

    onError(){
        let ret = this._getRetJSON();
        ret.type = 'error';
        this.callback_function( ret )
    }

}
