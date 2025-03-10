import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import pokemonCenterVideo from "../Videos/Background/pokemon-center.mp4";

export default function MenuPage(props) {
    const params = useParams()

    const [credits, setCredits] = useState(props.getUser(params.name).credits)

    const disconnect = () => {
        props.goto('/')
    }

    const tryToGoToBuyPokeRuppins = () => {
        if (credits >= 15) {
            props.useCredits(params.name, 15)
            props.goto(`/getPokeRuppins/${params.name}`)
        }
    }

    return (
        <div className="menuPage">

            <div className="profilFace"></div>
            <div className="helloMsg">
                <h1>Hello {params.name} !</h1>
                <h1 className="reflectMsg">Hello {params.name} !</h1>
            </div>
            <div className="centerPage">
                <div onClick={tryToGoToBuyPokeRuppins} className="getPokeRuppins">
                    <h1>Get</h1><h2>PokeRuppins</h2>
                    <div className="creditStyle" style={credits < 15 ? { color: 'yellow', background: 'red', border: 'black solid 4px' } : {}}>
                        <h3>Cost 15 credits</h3>
                    </div>
                </div>
                <div onClick={() => props.goto(`/myRuppinDex/${params.name}`)} className="myPokeRuppinDex"><h1>My</h1><h2>PokeRuppinDex</h2></div>
                <div onClick={() => props.goto(`/getCredits/${params.name}`)} className="buyCredits"><h1>Get</h1><h2>Credits</h2></div>
            </div>

            <button onClick={() => props.goto(`/getCredits/${params.name}`)} className="creditsCount creditStyle">{credits}</button>
            <button className="disconnectBtn" onClick={disconnect}>Disconnect</button>

            <video className="backgroundVideo" src={pokemonCenterVideo} autoPlay loop muted></video>
        </div>
    )
}
