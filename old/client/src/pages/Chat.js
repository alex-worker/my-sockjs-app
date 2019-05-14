import React from 'react';

export default class Chat extends React.Component {

    state = {
        history: [],
        // message: ''
    }

    constructor(){
        super()
        this.messRef = React.createRef();
    }

    render() {
        let { history } = this.state
        return <div id='message-list' ref={ this.messRef } ><ul>{
            history.map( (mess,i) => {
                return <li key={i}>
                    <div className='message-from'>buhaha:</div>
                    <div className='message-text'>{mess}</div>
                    </li>
            })
        }</ul></div>
    }

    componentDidUpdate () {
        var el = this.messRef.current;
        el.scrollTop = el.scrollHeight;
    }

    addMessage( id, mess ){
        console.log( id )
        this.setState( { history: [...this.state.history, mess] })
    }

    setHistory( hist ){
        console.log( 'history:' )
        console.log( hist )
        this.setState( { history: hist })
    }

}

