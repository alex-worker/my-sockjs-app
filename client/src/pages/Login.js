import React from 'react'
import PropTypes from 'prop-types';
// import Button from 'muicss/lib/react/button';
// import Container from 'muicss/lib/react/Container';
// import Input from 'muicss/lib/react/Input';
// import Panel from 'muicss/lib/react/panel';

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
        // let {username} = this.state;
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
