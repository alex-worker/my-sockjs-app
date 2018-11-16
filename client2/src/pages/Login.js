import React from 'react';
import cookie from 'react-cookies'

export const Login = (props) => {

    const mySubmit = (e) => {
        e.preventDefault()
        cookie.save('userId', 100500, { path: '/' })
        // document.cokokie = "userName=Vasya"
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