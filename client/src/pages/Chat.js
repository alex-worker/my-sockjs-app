import React from 'react';
// import PropTypes from 'prop-types';

export default class Chat extends React.Component {

    state = {
        history: [],
        // message: ''
    }

    // constructor(){
        // super()
        // this.logList = React.createRef()
    // }

    render() {
        let { history } = this.state
        console.log( 'render history')
        console.log( history )
        return <div id='my_list'>{
            history.map( (mess,i) => {
                return <div key={i}>{mess}</div>
            })
        }</div>

    }

    // appendMessage (type, message, id) {
        // console.log( type )
        // console.log( message )
        // console.log( id )
    // }
    
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

// Chat.propTypes = {
    // onSay: PropTypes.func.isRequired,
    // history: PropTypes.arrayOf( PropTypes.string ).isRequired
    // history: PropTypes.arrayOf( PropTypes.shape({
    //     id: PropTypes.string,
    //     message: PropTypes.string
    // }

    // ) )
    // message: PropTypes.string
// }
