import React from 'react'
import PropTypes from 'prop-types';

class Login extends React.Component {
    
    state = {
        username: 'guest'
    }

    onSubmit = (event) => {
        this.props.onSubmit( this.state.username )
        event.preventDefault()
    }

    onChange = (event) => {
        this.setState( {username:event.target.value })
    }

    render() {
        let {username} = this.state;
        return <div>
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type='text' name='name' value={username} placeholder='your name please' onChange={this.onChange.bind(this)} />
                <button>Go to chat</button>
            </form>
        </div>
    }
}

Login.propTypes = {
        onSubmit: PropTypes.func.isRequired
}

export default Login
