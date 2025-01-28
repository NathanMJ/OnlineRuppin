import { useState } from "react"
import { useParams } from "react-router-dom"
import ReturnMenuBtn from "../FuncComps/ReturnMenuBtn"

export default function GetCredits(props) {
    const params = useParams()
    const [credits, setCredits] = useState(props.getUser(params.name).credits)
    
    const buy = (quantity) => {
        props.buyCredits(params.name,quantity)
        const newCredits = credits + quantity
        setCredits(newCredits)
    }

    return (
        <div className="getCreditsPage">
            <h1>Shop credits</h1>
            <div className="AllContainers">
                <div className="container" onClick={() => buy(5)}>
                    <img src="../src/Pictures/Credits/5-credits.png" alt="" />
                    <h1>Buy 5 credits</h1>
                </div>
                <div onClick={() => buy(25)} className="container">
                    <img src="../src/Pictures/Credits/25-credits.png" alt="" />
                    <h1>Buy 25 credits</h1>
                </div>
                <div onClick={() => buy(100)} className="container">
                    <img src="../src/Pictures/Credits/100-credits.png" alt="" />
                    <h1>Buy 100 credits</h1>
                </div>

            </div>
            <button className="creditsCount creditStyle">{credits}</button>
            <ReturnMenuBtn name={params.name} goto={props.goto}></ReturnMenuBtn>
        </div>
    )
}
