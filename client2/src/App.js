import React, { useReducer } from 'react'
import './App.scss'
import {Header} from './layouts/Header'
import {Footer} from './layouts/Footer'
import {Login} from './pages/Login'
import {Loading} from './pages/Loading'

import Client from './client'

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

const conf = {
  "protocol": "http",
    "ip": "0.0.0.0",
    "port": 9999,
    "bound": "chat"
}

function processClient( mess ){
  // if ( this.callbackArray[mess.type] === undefined ) {
    console.log( mess )
  }

const doLogin = (state,action) => {
  // setPage('Loading')
  client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient );
  client.connect();
  return { ...state, page:'Loading', login: action.name};
}

const reducer = (state,action) => {
  // console.log( state )
  // console.log( action )
  switch (action.type) {
    case 'login': return doLogin(state,action);
    default:
      console.log( 'unsupported action:'+action)
      return state
  }
}

const App = () => {

  // const [error,setError] = useState( '' )
  // const [login,setLogin] = useState( default_user )
  // const [page,setPage] = useState( default_page )
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const getCurrentPage = ( page ) => {
    if ( page === 'Login')
      return <Login username={state.login} onSubmit={ (name)=>{ dispatch({type:'login',name:name}) } } />
    if ( page === 'Login')
      return <Loading />
    return 'unsupported '+page
  }

  // console.log( some_data )
  return (
  <>
    <Header />{state.login} {state.page} {state.error}
    <div className="central">{getCurrentPage(state.page)}</div>
    <Footer />
  </>
  )

}

export default App

