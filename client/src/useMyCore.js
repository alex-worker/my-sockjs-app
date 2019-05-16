import { useState, useEffect } from "react";

export let useMyCore = (action, username) => {
    let [state, setState] = useState('Login')
    let [name, setName] = useState('guest')
    
    let myEffectOff = () => {
        console.log( 'effect off')
    //     setState('effect off')
    }

    let myEffectOn = () => {
        console.log( 'effect on')
        setName(username)
        setState('Login')
        return myEffectOff
    }

    useEffect( myEffectOn, [action] );

    return state
    // return 'Login'
}
