import { useParams } from "react-router-dom"
import pokemonCenterVideo from "../Videos/Background/pokemon-center.mp4";

export default function MenuPage(props) {
    const params = useParams()

    return (
        <div className="menuPage">
            <h1>Hello {params.name}</h1>


            <video className="backgroundVideo" src={pokemonCenterVideo} autoPlay loop muted></video>
        </div>
    )
}
