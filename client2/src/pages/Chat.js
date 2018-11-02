import React from 'react';
import { useState } from 'react'

import Client from '../client'
import conf from '../config'

var client

export const Chat = (props) => {

    // const[state, setState] = useState(null)

    const myClose = () => {
        // setState(false)
        // console.log( e )
        props.onClose( 'Server closed' )
    }

    const callbackArray = {
        '-close': myClose,
        // '-open': {},
        // '-packet': {}
    }

    const processClient= ( mess ) => {
        if ( callbackArray[mess.type] === undefined ) {
            console.error('unsupported type:' + mess.type )
            return
        }
        callbackArray[mess.type]( mess )
    }

    console.log('try login '+props.username )
    client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient );
    client.connect();

    // if ( state === null )
        return <div>Wait...loading...</div>
    
    // setState(true)
    // return <div>Ok!</div>

}