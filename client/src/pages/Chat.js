import React from 'react';
// import PropTypes from 'prop-types';
// import List from '@material-ui/core/List';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItem from '@material-ui/core/ListItem';


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
        return <div id='messages' ref={ this.messRef } ><ul>{
            history.map( (mess,i) => {
                return <li key={i}>
                    <div>{mess}</div>
                    </li>
            })
        }</ul></div>
    }

    componentDidUpdate () {
        var el = this.messRef.current;
        el.scrollTop = el.scrollHeight;
    }

    addMessage( id, mess ){
        // this.appendMessage( 'message', mess, from )
        // messages: [...this.state.messages, message]
        console.log( id )
        this.setState( { history: [...this.state.history, mess] })
    }

    setHistory( hist ){
        console.log( 'history:' )
        console.log( hist )
        this.setState( { history: hist })
    }

}

