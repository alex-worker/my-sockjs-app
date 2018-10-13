import React from 'react'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
        return <Grid container direction="column" justify="center" alignItems="center">
            <form onSubmit={this.onSubmit.bind(this)}>
                <Grid item><TextField label="Name" margin="normal" variant="outlined" name='name' value={username} placeholder='your name please' onChange={this.onChange.bind(this)} /></Grid>
                <Grid item><Button fullWidth variant="contained" color="primary" type='submit' >Go to chat</Button></Grid>
            </form>
        </Grid>
    }
}

Login.propTypes = {
        onSubmit: PropTypes.func.isRequired
}

export default Login
