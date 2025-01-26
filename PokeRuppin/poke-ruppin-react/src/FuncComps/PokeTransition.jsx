import '../Styles/MainPage.css'
import topImage from '../Pictures/Transition/top.png';
import bottomImage from '../Pictures/Transition/bottom.png';

import { useEffect } from 'react';

export default function PokeTransition(props) {

    useEffect(() => {
        //activating the transition
        if (props.rendTransition) {

            //set the transition to desactivate (to activate it later) 
            setTimeout(() => {
                props.transition(false)
            }, 1500)
        }

    }, [props.rendTransition])

    return (
        <div id="pokeRuppinTransition" style={{ display: `${props.rendTransition ? 'flex' : 'none'}` }} >
            <div id="top">
                <img src={topImage} alt='Top' />
                <div id="backgroundTop"></div>
            </div>

            <div id="bottom">
                <img src={bottomImage} alt='Bottom' />
                <div id="backgroundBottomLeft"></div>
                <div id="backgroundBottomRight"></div>
                <div id="backgroundBottomBottom"></div>
            </div>
        </ div>
    )
}
