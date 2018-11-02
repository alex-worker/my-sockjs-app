import React, { useState } from 'react'
import './App.scss'
import {Header} from './layouts/Header'
import {Footer} from './layouts/Footer'
import {Login} from './pages/Login'
import {Chat} from './pages/Chat'

const default_user = 'guest'
const default_page = 'Login'

const App = () => {
  
  const [error,setError] = useState( '' )
  const [login,setLogin] = useState( default_user )
  const [page, setPage] = useState( default_page )
  
  const onMyLogin = ( login ) => {
    console.log( 'onMyLogin' )
    setLogin(login)
    setError('')
    setPage('Chat')
  }
  
  const onMyClose = ( mess ) => {
    console.log( 'onMyClose' )
    setPage('Login')
    setError(mess)
  }
  
  const getCurrentPage = ( ) => {
    if ( page === 'Login')
      return <Login username={login} onSubmit={ onMyLogin } />
    if ( page === 'Chat')
      return <Chat username={login} onClose={ onMyClose }/>
    return 'unsupported '+page
  }

  console.log( 'app...' )

  return (
  <>
    <Header />{error}
    <div className="central">{ getCurrentPage() }</div>
    <Footer />
  </>
  )

}

export default App

