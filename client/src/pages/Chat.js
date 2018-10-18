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

    render() {
        let { history } = this.state
        console.log( 'render history')
        console.log( history )
        return <ul id='my_list'>{
            history.map( (mess,i) => {
                return <li key={i}>
                    <p key={i}>{mess}</p>
                    </li>
            })
        }</ul>
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

