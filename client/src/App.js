import React from 'react';
import Login from './pages/Login'
import {Header, Footer} from './layouts/'

class App extends React.Component {

    onConnect = () => {
        console.log( 'try connect ')
    }

    render() {
        return <>
        <Header />
        <Login onSubmit={this.onConnect.bind(this)} />
        <Footer />
        </>
    }
    
}

export default App;