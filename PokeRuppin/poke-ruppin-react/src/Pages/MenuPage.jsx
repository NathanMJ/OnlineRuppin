import { useState } from "react"
import { useParams} from "react-router-dom"
import pokemonCenterVideo from "../Videos/Background/pokemon-center.mp4";

export default function MenuPage(props) {
    const params = useParams()

    const [credits, setCredits] = useState(15)

    const disconnect = () => {
        props.goto('/')
    }

    return (
        <div className="menuPage">

            <div className="profilFace"></div>
            <div className="helloMsg">
                <h1>Hello {params.name} !</h1>
                <h1 className="reflectMsg">Hello {params.name} !</h1>
            </div>
            <div className="centerPage">
                <div className="getPokeRuppins"><h1>Get</h1><h2>PokeRuppins</h2><div className="creditStyle"><h3>Cost 15 credits</h3></div></div>
                <div className="myPokeRuppinDex"><h1>My</h1><h2>PokeRuppinDex</h2></div>
                <div className="buyCredits"><h1>Get</h1><h2>Credits</h2></div>
                <div className="buyPokeRuppins"><h1>Buy</h1><h2>PokeRuppins</h2></div>
            </div>

            <button className="creditsCount creditStyle">{credits}</button>
            <button className="disconnectBtn" onClick={disconnect}>Disconnect</button>

            <video className="backgroundVideo" src={pokemonCenterVideo} autoPlay loop muted></video>
        </div>
    )
}
