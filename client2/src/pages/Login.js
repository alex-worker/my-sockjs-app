import React from 'react';

export const Login = (props) => {

    const mySubmit = (e) => {
        e.preventDefault()
        // console.log( e.target.login.value )
        props.onSubmit( e.target.login.value  )
    }

    return <div>
        <form onSubmit={mySubmit}>
            <input label="Name" id="login" defaultValue={ props.username }/>
            <button color="primary">Go to chat</button>
        </form>
    </div>

}

// export default Login;