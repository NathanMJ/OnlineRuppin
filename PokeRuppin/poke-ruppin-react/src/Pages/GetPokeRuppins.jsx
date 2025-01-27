import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function GetPokeRuppins(props) {
    const params = useParams()

    const [indexChoosen, setIndexChoosen] = useState(0)


    const [firstBall, setFirstBall] = useState({ open: false, moving: false })
    const [secondBall, setSecondBall] = useState({ open: false, moving: false })
    const [thirdBall, setThirdBall] = useState({ open: false, moving: false })

    const [whiteAllPage, setWhiteAllPage] = useState(false)
    
    const [showButton, setShowButton] = useState(false)

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



    useEffect(() => {
        if (firstBall.moving) {
            setTimeout(() => {
                setFirstBall({ ...firstBall, moving: false })
            }, 750)
        }
    }, [firstBall.moving])

    useEffect(() => {
        if (secondBall.moving) {
            setTimeout(() => {
                setSecondBall({ ...secondBall, moving: false })
            }, 750)
        }
    }, [secondBall.moving])

    useEffect(() => {
        if (thirdBall.moving) {
            setTimeout(() => {
                setThirdBall({ ...thirdBall, moving: false })
            }, 750)
        }
    }, [thirdBall.moving])

    const openingAnimation = () => {

        //first ball move
        setTimeout(() => {
            setFirstBall({ ...firstBall, moving: true })
        }, 1000)


        //first and third ball move
        setTimeout(() => {
            setFirstBall({ ...firstBall, moving: true })
            setThirdBall({ ...secondBall, moving: true })
        }, 2000)

        //every balls move
        setTimeout(() => {
            setFirstBall({ ...firstBall, moving: true })
            setSecondBall({ ...secondBall, moving: true })
            setThirdBall({ ...thirdBall, moving: true })
        }, 3000)

        //all the page is whited (opacity from 0 to 1 to 0)
        //the left one is open

        setTimeout(() => {
            setFirstBall({ ...firstBall, open: true })
            setWhiteAllPage(true)
        }, 4000)

        //fastly the right one too

        setTimeout(() => {
            setThirdBall({ ...thirdBall, open: true })
        }, 4300)

        //fastly the middle one too

        setTimeout(() => {
            setSecondBall({ ...secondBall, open: true })
        }, 4600)


        //we can see the cards now

        setTimeout(() => {
            setCard()
            setShowButton(true)
        }, 5000)

        setTimeout(()=>{
            setWhiteAllPage(false)
        },6000)


    }


    const setCard = () => {
        const firstCardSrc = '../src/Pictures/PokeCards/sasha-gold.png'
        const secondCardSrc = '../src/Pictures/PokeCards/shay-gold.png'
        const thirdCardSrc = '../src/Pictures/PokeCards/habib-gold.png'
        
        setFirstBall({ ...firstBall, src: firstCardSrc })
        setSecondBall({ ...secondBall, src: secondCardSrc })
        setThirdBall({ ...thirdBall, src: thirdCardSrc })
    }


    return (
        <div className="getPokeRuppinsPage">

            <div className="whiteAllPage" style={{ display: whiteAllPage ? 'block' : 'none' }}></div>

            <button className="returnMenu" onClick={()=>{props.goto(`/menuPage/${params.name}`)}} style={{display: showButton? 'block':'none'}}>Return to the menu</button>

            <div className="h1Container">
                <h1>Choose one of the three PokeRuppinBall !</h1>
            </div>
            <div className="everypokeRuppinBallContainer">
                <div className="pokeRuppinBallsContainer">
                    <img style={{ display: firstBall.open ? 'none' : 'block' }} className={`pokeBallClose ${firstBall.moving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(1)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img style={{ display: firstBall.open ? 'block' : 'none' }} className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                    <img style={{ display: firstBall.src ? 'block' : 'none' }} className="pokeCard" src={firstBall.src} alt="pokeCard" />
                </div>
                <div className="pokeRuppinBallsContainer">
                    <img style={{ display: secondBall.open ? 'none' : 'block' }} className={`pokeBallClose ${secondBall.moving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(2)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img style={{ display: secondBall.open ? 'block' : 'none' }} className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                    <img style={{ display: secondBall.src ? 'block' : 'none' }} className="pokeCard" src={secondBall.src} alt="pokeCard" />

                </div>
                <div className="pokeRuppinBallsContainer">
                    <img style={{ display: thirdBall.open ? 'none' : 'block' }} className={`pokeBallClose ${thirdBall.moving ? 'pokeBallMoving' : ''}`} onClick={() => choosePokeRuppin(3)} src="../src/Pictures/PokeRuppinBall/PokeRuppinBall.png" alt="pokeRuppinBallClose" />
                    <img style={{ display: thirdBall.open ? 'block' : 'none' }} className="pokeBallOpen" src="../src/Pictures/PokeRuppinBall/PokeRuppinBallOpen.png" alt="pokeRuppinBallOpen" />
                    <img style={{ display: thirdBall.src ? 'block' : 'none' }} className="pokeCard" src={thirdBall.src} alt="pokeCard" />
                </div>
            </div>

        </div>
    )
}
