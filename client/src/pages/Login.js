import React from 'react'
import PropTypes from 'prop-types';

class Login extends React.Component {
    
    state = {
        username: this.props.username
    }

    onSubmit = (event) => {
        this.props.onSubmit( this.state.username )
        event.preventDefault()
    }

    onChange = (event) => {
        this.setState( {username:event.target.value })
    }
  
    render() {
        return <div>
            <form onSubmit={this.onSubmit.bind(this)}>
            <input
                label="Name"
                value={this.state.username}
                onChange={ this.onChange.bind(this)}
                />
                <button color="primary">Go to chat</button>
            </form>
        </div>
    }
}

Login.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        username: PropTypes.string
}

export default Login
