import { use, useEffect, useState } from "react"

export default function FCGame(props) {



    /*
      TODO:
        make arrows to says where to play or not to play
          green you win 100%
          orange you can loose
          red you loose 100%
        swap the game according to your color
        the king can not be moved if he is in check
        if the king is in check and can not be moved, the game is over

    */

    //According to the rule it will change the eat square 
    //If no rule just show the game

    const [clickedSquare, setClickedSquare] = useState(null)
    const [previewSquares, setPreviewSquares] = useState([])
    const [eatSquares, setEatSquares] = useState([])
    const [currentGame, setCurrentGame] = useState(props.game)


    /*
        Rules :
            normal
            giveaway
    */

    const rule = props.rule;

    useEffect(() => {
        if (props.changePropGame && props.game !== currentGame) {
            props.changePropGame(currentGame);
        }
    }, [currentGame, props.changePropGame, props.game]);


    const setTurn = (turn) => {
        setCurrentGame(prevGame => ({ ...prevGame, turn }))
    }

    const setWinner = (winner) => {
        setCurrentGame(prevGame => ({ ...prevGame, winner }))
    }

    const setPawns = (pawns) => {
        setCurrentGame(prevGame => ({ ...prevGame, pawns }))
    }

    const writePawns = (x, y, game) => {

        const pawn = game.pawns.find(pawns => pawns.x == x && pawns.y == y)
        if (pawn) {
            return <div className={`pawn`}><img src={`/${pawn.color}_${pawn.name}.webp`}></img></div >
        }
    }

    const isSelected = (x, y) => {
        return clickedSquare
            && clickedSquare.y == y
            && clickedSquare.x == x;
    }

    const isTrajectory = (x, y) => {
        const isTrajectory = previewSquares.some(square => square.x == x && square.y == y)
        return isTrajectory
    }

    const isAnEatenSquare = (x, y) => {
        const isTrajectory = eatSquares.some(square => square.x == x && square.y == y)
        return isTrajectory
    }

    const setHelpEmplacement = (x, y) => {
        const help = props.showCoordonnates
        if (!help)
            return
        let writeOnSide = x == 0
        let writeOnLastLine = y == 0
        if (writeOnSide || writeOnLastLine)
            return <div className='helpSquare'>
                {writeOnLastLine && <p className='letterPosition'>{String.fromCharCode(x + 97)}</p>}
                {writeOnSide && <p className='numberPosition'>{y + 1}</p>}
            </div>
    }

    const movePawnTo = (ogPawn, x, y, pawns) => {
        const copyPawn = { ...ogPawn }
        //cleaned everyEnPassant property
        pawns.forEach(pawn => {
            delete pawn.enPassant
        })
        const front = getFront(ogPawn.color)
        //erase the pawn
        pawns = pawns.filter(pawn => !(pawn.x == ogPawn.x && pawn.y == ogPawn.y))
        //if the pawn is a pawn and the square to go is two squares forward, set the en passant property
        if (ogPawn.name == 'pawn' && Math.abs(y - ogPawn.y) == 2) {
            ogPawn.enPassant = true
        }
        //if the pawn is a pawn and the square before is a pawn of the other color remove it
        if (ogPawn.name == 'pawn' && isAPawn(pawns, x, y - front, otherColor(ogPawn.color))) {
            pawns = pawns.filter(pawn => !(pawn.x == x && pawn.y == y - front))
        }
        //remove the new location
        pawns = pawns.filter(pawn => !(pawn.x == x && pawn.y == y))

        //insert the pawn with the new location
        if (ogPawn.name == 'pawn') {
            if (ogPawn.color == 'white' && y == props.heightGame - 1) {
                copyPawn.name = 'queen'
            }
            if (ogPawn.color == 'black' && y == 0) {
                copyPawn.name = 'queen'
            }
        }
        pawns = [...pawns, { ...copyPawn, x, y }]
        //return the game
        return pawns
    }

    const clickOnSquare = (x, y) => {
        if (!props.movable)
            return

        if (currentGame.winner) {
            alert(`The game is over`)
        }

        //if the game is normal and there are 0 king cancel
        if (rule == 'normal'
            && (currentGame.pawns.filter(pawn => pawn.name == 'king' && pawn.color == 'white').length != 1
                || currentGame.pawns.filter(pawn => pawn.name == 'king' && pawn.color == 'black').length != 1)) {
            alert(`A king is missing, the game can not start`)
            return
        }

        if (clickedSquare && clickedSquare.x == x && clickedSquare.y == y) {
            setClickedSquare(null)
            setPreviewSquares([])
            setEatSquares([])
            return
        }
        //if the square is selected move the pawn to the square
        const isSelected = [...previewSquares, ...eatSquares].some(square => square.x == x && square.y == y)
        let pawns = currentGame.pawns
        if (isSelected) {

            const pawn = isAPawn(pawns, clickedSquare.x, clickedSquare.y)
            const newPawns = movePawnTo(pawn, x, y, pawns)
            setClickedSquare()
            setEatSquares([])
            setPreviewSquares([])

            setPawns(newPawns)
            setTurn(currentGame.turn == 'white' ? 'black' : 'white')


            //if the opponnent can not play anymore, he won
            const pawnCanMove = aPawnCanMove(otherColor(currentGame.turn), newPawns)
            if (!pawnCanMove) {
                if (rule == 'giveaway') {
                    setWinner(otherColor(currentGame.turn))
                    return
                }
                else if (rule == 'normal') {
                    const kingIsInCheck = isKingIsInCheck(newPawns, otherColor(currentGame.turn))
                    if (kingIsInCheck) {
                        setWinner(currentGame.turn)
                    }
                    else {
                        setWinner(otherColor(currentGame.turn))
                    }
                }
            }


        }
        else {
            setClickedSquare({ x, y })
            setEatSquares([])
        }
    }

    useEffect(() => {
        if (clickedSquare) {
            setEveryPreviewSquare(clickedSquare.x, clickedSquare.y)
        }
    }, [clickedSquare])

    const getFront = (color) => {
        return color == 'white' ? 1 : -1
    }

    const getMovementsOfPawn = (pawns, pawn) => {
        const front = getFront(pawn.color)
        const turn = pawn.color
        let { x, y } = pawn
        // movements = ['one forward', '+', 'square', 'X', 'L', 'front left', 'front right']

        let movements = []

        switch (pawn.name) {
            case 'pawn':

                if (!isAPawn(pawns, x, y + front)) {
                    movements.push('one forward')
                    if (((y == 1 && pawn.color == 'white') ||
                        (y == props.heightGame - 2 && pawn.color == 'black'))
                        && !isAPawn(pawns, x, y + 2 * (front))) {
                        movements.push('two forward')
                    }
                }
                if (isAPawn(pawns, x + 1, y + front, otherColor(turn))) {
                    movements.push('front right')
                }
                if (isAPawn(pawns, x - 1, y + front, otherColor(turn))) {
                    movements.push('front left')
                }
                if (isAPawn(pawns, x + 1, y, otherColor(turn))?.hasOwnProperty('enPassant')) {
                    movements.push('en passant right')
                }
                if (isAPawn(pawns, x - 1, y, otherColor(turn))?.hasOwnProperty('enPassant')) {
                    movements.push('en passant left')
                }
                break
            case 'queen':
                movements = ['+', 'x',]
                break
            case 'bishop':
                movements = ['x']
                break
            case 'rook':
                movements = ['+']
                break
            case 'knight':
                movements = ['L']
                break
            case 'king':
                movements = ['square']
                break
        }

        let tempPreviewSquares = []
        let tempEatSquares = []
        if (movements.includes('one forward')) {
            tempPreviewSquares.push({ x, y: y + front })
        }
        if (movements.includes('two forward')) {
            tempPreviewSquares.push({ x, y: y + 2 * front })
        }
        if (movements.includes('front right')) {
            tempPreviewSquares.push({ x: x + 1, y: y + front })
        }
        if (movements.includes('en passant right')) {
            tempEatSquares.push({ x: x + 1, y: y + front })
        }
        if (movements.includes('front left')) {
            tempPreviewSquares.push({ x: x - 1, y: y + front })
        }
        if (movements.includes('en passant left')) {
            tempEatSquares.push({ x: x - 1, y: y + front })
        }
        if (movements.includes('+')) {
            //right side
            for (let i = 1; i + x < props.widthGame; i++) {
                const findedPawn = isAPawn(pawns, x + i, y)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x + i, y })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x + i, y })
                    }
                    break;
                }
            }
            //left side
            for (let i = 1; x - i >= 0; i++) {
                const findedPawn = isAPawn(pawns, x - i, y)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x - i, y })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x - i, y })
                    }
                    break;
                }
            }

            //top side
            for (let i = 1; i + y < props.heightGame; i++) {
                const findedPawn = isAPawn(pawns, x, y + i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x, y: y + i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x, y: y + i })
                    }
                    break;
                }
            }
            //bottom side
            for (let i = 1; y - i >= 0; i++) {
                const findedPawn = isAPawn(pawns, x, y - i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x, y: y - i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x, y: y - i })
                    }
                    break;
                }
            }
        }
        if (movements.includes('x')) {
            //botton right side
            for (let i = 1; i + y < props.heightGame && i + x < props.heightGame; i++) {
                const findedPawn = isAPawn(pawns, x + i, y + i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x + i, y: y + i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x + i, y: y + i })
                    }
                    break;
                }
            }
            //botton left side
            for (let i = 1; y + i < props.heightGame && x - i >= 0; i++) {
                const findedPawn = isAPawn(pawns, x - i, y + i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x - i, y: y + i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x - i, y: y + i })
                    }
                    break;
                }
            }
            //top left side
            for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                const findedPawn = isAPawn(pawns, x - i, y - i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x - i, y: y - i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x - i, y: y - i })
                    }
                    break;
                }
            }
            //top right side
            for (let i = 1; y - i >= 0 && x + i >= 0; i++) {
                const findedPawn = isAPawn(pawns, x + i, y - i)
                if (!findedPawn) {
                    tempPreviewSquares.push({ x: x + i, y: y - i })
                }
                else {
                    if (findedPawn.color != turn) {
                        tempPreviewSquares.push({ x: x + i, y: y - i })
                    }
                    break;
                }
            }
        }
        if (movements.includes('L')) {
            for (let a = 1; a <= 2; a++) {
                let b = (a == 1 ? 2 : 1)
                for (let c = 1; c <= 2; c++)
                    for (let d = 1; d <= 2; d++) {
                        let newX = x + a * Math.pow(-1, c)
                        let newY = y + b * Math.pow(-1, d)
                        if (!isAPawn(pawns, newX, newY, turn))
                            tempPreviewSquares.push({ x: newX, y: newY })
                    }
            }
        }
        if (movements.includes('square')) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) continue // skip the current square
                    let newX = x + i
                    let newY = y + j
                    if (isAPawn(pawns, newX, newY, turn)) continue // skip if there is a pawn of the same color
                    if (0 <= newX && newX < props.widthGame && 0 <= newY && newY < props.heightGame) {
                        tempPreviewSquares.push({ x: newX, y: newY })
                    }
                }
            }
        }

        //change the preview square where there is a pawn to eatSquares 

        tempEatSquares = [...tempEatSquares, ...tempPreviewSquares.filter(square => isAPawn(pawns, square.x, square.y))]
        tempPreviewSquares = tempPreviewSquares.filter(square => !isAPawn(pawns, square.x, square.y))

        tempPreviewSquares = sortMovements(pawn, tempPreviewSquares)
        tempEatSquares = sortMovements(pawn, tempEatSquares)
        return { tempPreviewSquares, tempEatSquares }
    }


    const isKingIsInCheck = (pawns, colorOfTheKing) => {
        const king = pawns.find(pawn => pawn.name == 'king' && pawn.color == colorOfTheKing)
        if (!king) {
            return false;
        }
        //get every other pawn of the other color
        //find every eatSquare of the other color
        const otherColorPawns = pawns.filter(pawn => pawn.color != colorOfTheKing)
        let opponnentEatSquares = otherColorPawns.flatMap(pawn => {
            const { tempEatSquares } = getMovementsOfPawn(pawns, pawn)
            return tempEatSquares
        });

        opponnentEatSquares = opponnentEatSquares.filter((square, index) =>
            opponnentEatSquares.findIndex(s => s.x === square.x && s.y === square.y) === index
        ); // Remove duplicates


        //check if the king is in check

        const isInCheck = opponnentEatSquares.some(square => square.x == king.x && square.y == king.y);

        return isInCheck;
    }

    //TODO WORK ON THIS FUNCTION
    const sortMovements = (pawn, movements) => {
        if (rule == 'normal') {
            const filteredMovements = movements.filter(movement => {
                const tempPawns = [...currentGame.pawns]; // Créer une copie
                const newPawns = movePawnTo(pawn, movement.x, movement.y, tempPawns);
                return !isKingIsInCheck(newPawns, pawn.color);
            });
            return filteredMovements;
        }
        return movements;
    }


    const aPawnCanMove = (color, pawns) => {
        //check if the pawns of the color can move
        if (rule == 'giveaway' || rule == 'normal') {

            const colorPawns = pawns.filter(pawn => pawn.color == color)
            if (colorPawns.length == 0) {
                return false
            }

            for (let pawn of colorPawns) {
                const { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(pawns, pawn)

                if (tempEatSquares.length > 0 || tempPreviewSquares.length > 0)
                    return true
            }
            return false
        }

        return false
    }

    const setEveryPreviewSquare = (x, y) => {
        const pawn = currentGame.pawns.find(pawn => pawn.x == x && pawn.y == y)
        if (!pawn || pawn.color != currentGame.turn) {
            setPreviewSquares([])
            return
        }

        let { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(currentGame.pawns, pawn)


        //for the giveaway rule :
        //if a pawn can be eaten by another pawn of the color's turn set tempPreviewSquares to empty
        if (props.rule == 'giveaway' && (tempEatSquares.length > 0 || aPawnCanBeEat(currentGame.pawns, currentGame.turn))) {
            tempPreviewSquares = []
        }

        setPreviewSquares(tempPreviewSquares)
        setEatSquares(tempEatSquares)
    }

    const aPawnCanBeEat = (pawns, color) => {
        for (let pawn of pawns) {
            if (pawn.color == color) {
                const { tempEatSquares } = getMovementsOfPawn(pawns, pawn)
                if (tempEatSquares.length > 0) {
                    return true
                }
            }
        }
        return false
    }

    const isAPawn = (pawns, x, y, color) => {

        if (!(0 <= x && x < props.widthGame && 0 <= y && y <= props.heightGame))
            return false
        if (color) {
            return pawns.find(pawn => pawn.x == x && pawn.y == y && pawn.color == color)
        }
        return pawns.find(pawn => pawn.x == x && pawn.y == y)
    }

    const otherColor = (color) => {
        if (color == 'white')
            return 'black'
        else if (color == 'black')
            return 'white'
        return null
    }


    return (<div className='chessGame'>
        {[...Array(props.heightGame)].map((_, indexRow) => {
            const invertedIndexRow = props.heightGame - 1 - indexRow
            return (
                <div className='rows' key={indexRow}>
                    {[...Array(props.widthGame)].map((_, indexColumn) => (
                        <div className={`squares ${(invertedIndexRow + indexColumn) % 2 == 0 ? 'even' : 'odd'} ${isSelected(indexColumn, invertedIndexRow) ? 'selected' : ''} 
              ${isTrajectory(indexColumn, invertedIndexRow) && 'trajectory'}
                ${isAnEatenSquare(indexColumn, invertedIndexRow) && 'canBeTaken'}
              `}
                            key={indexColumn}
                            style={{ height: `${props.sizeSquare}px`, width: `${props.sizeSquare}px` }}
                            onClick={() => { clickOnSquare(indexColumn, invertedIndexRow) }}>
                            {setHelpEmplacement(indexColumn, invertedIndexRow)}
                            {writePawns(indexColumn, invertedIndexRow, currentGame)}
                        </div>
                    ))}
                </div>
            )
        })}
    </div>
    )
}


