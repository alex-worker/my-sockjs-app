import React from 'react'

class Login extends React.Component {
    
    state = {
        username: 'guest'
    }

    onSubmit = (event) => {
        // console.log(event.target)
        event.preventDefault();
    }

    onChange = (event) => {
        // console.log( event.target.name )
        // console.log( event.target.value )
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

export default Login
