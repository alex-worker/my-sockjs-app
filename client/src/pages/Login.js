import React from 'react'
import PropTypes from 'prop-types';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';

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
        let {username} = this.state;
        return <div className='customDiv'>
        <div>
            <form onSubmit={this.onSubmit.bind(this)}>
                <div><input label="Name" name='name' value={username} placeholder='your name please' onChange={this.onChange.bind(this)} /></div>
                <div><button>Go to chat</button></div>
            </form>
        </div></div>
    }
}

Login.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        username: PropTypes.string
}

export default Login
