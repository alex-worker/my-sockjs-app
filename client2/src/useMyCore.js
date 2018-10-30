import { useState, useEffect } from "react";

export let useMyCore = (params) => {
    let [state, setState] = useState({my_test:'sss'});
    
    let myEffectOff = () => {
        console.log( 'effect off')
    }

    let myEffectOn = () => {
        console.log( 'effect on')
        return myEffectOff
    }

    useEffect( myEffectOn, params );

    // // return [state]
    // console.log( 'useMyCore' );
    // console.log( params );

    return [state];
}
