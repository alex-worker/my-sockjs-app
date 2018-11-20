import React from 'react';
import { useState, useEffect, useReducer, useRef } from 'react'

import Client from '../client'
import conf from '../config'

var client

const reducerMess = ( mess_list, action ) => {
    // console.log( 'reduce ');
    // console.log( mess_list );
    // console.log( action );
    switch (action.type) {
        case 'history':
            return action.message
        case 'message':
            mess_list.push( action.message )
            return mess_list
        case 'userLeft':
            mess_list.push( 'some user left...' )
            return mess_list
        case 'newUser':
            mess_list.push( 'income new user...' )
            return mess_list
        default:
            console.log( 'unsupported action '+action.type)
            return mess_list;
    }
}

export const Chat = (props) => {

    const[isOnline, setIsOnline] = useState(null)
    const[messages, dispatchMessage] = useReducer( reducerMess, [] )

    const messListRef = useRef(null)

    const myClose = () => {
        setIsOnline( false )
        props.onClose( 'Server closed' )
    }

    const myOpen = () => {
        setIsOnline( true )
    }

    const myPacket = ( packet ) => {
        // console.log( packet )
        // processClient( JSON.parse(packet.message) )
        dispatchMessage( JSON.parse(packet.message) )
    }

    const callbackArray = {
        '-close': myClose,
        '-open': myOpen,
        '-packet': myPacket
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

    const myOnlineOn = () => {
        // console.log( 'myEffectOn' )
        // console.log('try login '+props.username )
        client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port+'/'+conf.bound, processClient );
        // client = new Client( conf.protocol+"://"+conf.ip+':'+conf.port, processClient );
        client.connect( props.username );
        return myEffectOff
    }

    const messChanges = () => {
        console.log( 'mess changes...')
        // console.log( messages )
        var el = messListRef.current
        // console.log( el )
        if ( el !== null ) el.scrollTop = el.scrollHeight
    }

    useEffect( myOnlineOn, [props]  )
    useEffect( messChanges )
    // useLayoutEffect( messChanges, [messages]  )

    console.log( 'Chat... ')
    // console.log( messages )

    if ( isOnline === null )
        return <div>Wait...loading...</div>
    
    if ( isOnline === false )
        return <div>disconnected...</div>

    return <div id='message-list' ref={ messListRef }>
            <ul>{
                messages.map( (mess,i) => {
                return <li key={i}>
                    <div className='message-from'>buhaha:</div>
                    <div className='message-text'>{mess}</div>
                    </li>
                }) 
                }</ul>
        </div>
        


}