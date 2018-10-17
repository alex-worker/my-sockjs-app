import React from 'react';
// import PropTypes from 'prop-types';

export default class Chat extends React.Component {

    state = {
        history: [],
        message: ''
    }

    // constructor(){
        // super()
        // this.myRef = React.createRef();
    // }

    render() {
        let { history } = this.state
        let history_show = history.join(' ')
        // console.log( "Chat:" )
        // console.log( this.state )
        return <div>{ history_show }</div>
    }

    addMessage( mess ){
        this.setState( { message: mess })
    }

    setHistory( hist ){
        this.setState( { history: hist })
    }

}

// Chat.propTypes = {
    // onSay: PropTypes.func.isRequired,
    // history: PropTypes.arrayOf( PropTypes.string ),
    // message: PropTypes.string
// }
