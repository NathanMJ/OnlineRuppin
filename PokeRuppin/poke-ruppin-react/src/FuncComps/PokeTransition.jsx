import '../Styles/MainPage.css'
import topImage from '../Pictures/Transition/top.png';
import bottomImage from '../Pictures/Transition/bottom.png';

export default function PokeTransition(props) {

    if(props.rendTransition){
        setTimeout(()=>{
           props.transition(false)
        },1500)
    }

    return (
        <div id="pokeRuppinTransition" style={{ display: `${props.rendTransition ? 'flex' : 'none'}` }} >
        <div id="top">
            <img src={topImage} alt='Top'/>
            <div id="backgroundTop"></div>
        </div>

        <div id="bottom">
            <img src={bottomImage} alt='Bottom'/>
            <div id="backgroundBottomLeft"></div>
            <div id="backgroundBottomRight"></div>
            <div id="backgroundBottomBottom"></div>
        </div>
        
    </ div>
            )
}
