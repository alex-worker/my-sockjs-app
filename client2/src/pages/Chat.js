import React from 'react';
import { useState, useEffect } from 'react'

import Client from '../client'
import conf from '../config'

var client

export const Chat = (props) => {

    const[isOnline, setIsOnline] = useState(null)

    const myClose = () => {
        setIsOnline( false )
        props.onClose( 'Server closed' )
    }

    const myOpen = () => {
        setIsOnline( true )
    }

    // const myPacket = ( packet ) => {
    //     console.log( packet )
    //     // setState( true )
    //     // props.onClose( 'Server p' )
    // }

    const callbackArray = {
        '-close': myClose,
        '-open': myOpen,
    //     '-packet': myPacket
    }

    const processClient= ( mess ) => {
        if ( callbackArray[mess.type] === undefined ) {
            console.error('unsupported type:' + mess.type )
            return
        }
        callbackArray[mess.type]( mess )
    }

    const myEffectOff = () => {
        console.log( 'myEffectOff' )
    }

    const myEffectOn = () => {
        console.log( 'myEffectOn' )
        console.log('try login '+props.username )
        client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient );
        client.connect();
        return myEffectOff
    }

    useEffect( myEffectOn, [props]  )

    if ( isOnline === null )
        return <div>Wait...loading...</div>
    
    if ( isOnline === false )
        return <div>disconnected...</div>

    if ( isOnline === true )
        return <div>chat ok</div>

}