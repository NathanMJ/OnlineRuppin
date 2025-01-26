import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function GetPokeRuppins() {
    const params = useParams()

    const [indexChoosen, setIndexChoosen] = useState(0)


    const [firstBallMoving, setFirstBallMoving] = useState(false)
    const [secondBallMoving, setSecondBallMoving] = useState(false)
    const [thirdBallMoving, setThirdBallMoving] = useState(false)





    const choosePokeRuppin = (index) => {
        if (indexChoosen == 0) {
            setIndexChoosen(index)
        }
    }

    useEffect(() => {
        if (indexChoosen != 0) {
            console.log('go animation for ', indexChoosen);
            openingAnimation()
        }
    }, [indexChoosen])


    const openingAnimation = () => {
        setTimeout(() => {
            //the left one is moving
            setFirstBallMoving(true)

            setTimeout(() => {
                //the right one is moving
                setThirdBallMoving(true)

                setTimeout(() => {
                    //the middle one is moving
                    setSecondBallMoving(true)


                    setTimeout(() => {
                        //they all stop
                        setFirstBallMoving(false)
                        setSecondBallMoving(false)
                        setThirdBallMoving(false)

                    }, 1000)
                }, 1000)


            }, 1000)


            //the left one is open

            //fastly the right one too

            //fastly the middle one too

            //all the page is whited (opacity from 0 to 1 to 0)

            //we can see the cards now
        }, 1000)


    }



    return (
        <div className="getPokeRuppinsPage">
            <div className="h1Container">
                <h1>Choose one of the three PokeRuppinBall !</h1>
            </div>
            <div className="everypokeRuppinBallContainer">
                <div className="pokeRuppinBallsContainer">
                    <img className={`pokeBallClose ${firstBallMoving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(1)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                </div>
                <div className="pokeRuppinBallsContainer">
                    <img className={`pokeBallClose ${secondBallMoving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(2)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                </div>
                <div className="pokeRuppinBallsContainer">
                    <img className={`pokeBallClose ${thirdBallMoving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(3)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                </div>
            </div>
        </div>
    )
}
