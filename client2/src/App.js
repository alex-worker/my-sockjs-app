import React, { useState, useReducer } from 'react'
import './App.scss'
import {Header} from './layouts/Header'
import {Footer} from './layouts/Footer'
import {Login} from './pages/Login'
import {Loading} from './pages/Loading'

import Client from './client'
import { useMyCore } from './useMyCore';

// import { useMyCore } from "./useMyCore";

const default_user = 'guest'
const default_page = 'Login'

const initialState = {
  login: default_user,
  page: default_page,
  error: '',
  messages: []
}

var client

// const conf = {
//   "protocol": "http",
//     "ip": "0.0.0.0",
//     "port": 9999,
//     "bound": "chat"
// }

// function processClient( mess ){
//   // if ( this.callbackArray[mess.type] === undefined ) {
//     console.log( mess )
//     App.setError('ohoho')
//   }

// const doLogin = (state,action) => {
//   // setPage('Loading')
//   client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient );
//   client.connect();
//   return { ...state, page:'Loading', login: action.name};
// }

// const reducer = (state,action) => {
//   // console.log( state )
//   // console.log( action )
//   switch (action.type) {
//     case 'login': return doLogin(state,action);
//     default:
//       console.log( 'unsupported action:'+action)
//       return state
//   }
// }

// const myFunc = () => {
  // return [{image:'asdasd', count:10 },50]
// }

const App = () => {

  // let[{image:cnt,count}] = myFunc();
  // console.log( cnt )
  // console.log( count )
  // console.log( my_calue )

  const [error,setError] = useState( '' )
  const [login,setLogin] = useState( default_user )
  const [page,setPage] = useState( default_page )
  const [state] = useMyCore(login)
  // console.log( state )
  // const [state, dispatch] = useReducer(reducer, initialState);
  
  const getCurrentPage = ( page ) => {
    if ( page === 'Login')
      return <Login username={login} onSubmit={ setLogin } />
    if ( page === 'Loading')
      return <Loading />
    return 'unsupported '+page
  }

  console.log( 'app' )

  return (
  <>
    <Header />{login} {page} {error}
    <div className="central">{getCurrentPage(page)}</div>
    <Footer />
  </>
  )

}

export default App

