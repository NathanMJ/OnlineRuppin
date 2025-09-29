import { useEffect, useState } from "react"

export default function FCGame(props) {
    // Game state
    const [currentGame, setCurrentGame] = useState(props.game)
    const [clickedSquare, setClickedSquare] = useState(null)
    const [previewSquares, setPreviewSquares] = useState([])
    const [eatSquares, setEatSquares] = useState([])
    const rule = props.rule;

    // Update parent game state
    useEffect(() => {
        if (props.changePropGame && props.game !== currentGame) {
            props.changePropGame(currentGame);
        }
    }, [currentGame, props.changePropGame, props.game]);

    // Utility functions
    const setTurn = (turn) => {
        setCurrentGame(prevGame => ({ ...prevGame, turn }))
    }

    const setWinner = (winner) => {
        setCurrentGame(prevGame => ({ ...prevGame, winner }))
    }

    const setPawns = (pawns) => {
        setCurrentGame(prevGame => ({ ...prevGame, pawns }))
    }

    const getFront = (color) => {
        return color === 'white' ? 1 : -1
    }

    const otherColor = (color) => {
        if (color === 'white') return 'black'
        else if (color === 'black') return 'white'
        return null
    }

    const isAPawn = (pawns, x, y, color) => {
        if (!(0 <= x && x < props.widthGame && 0 <= y && y < props.heightGame))
            return false
        if (color) {
            return pawns.find(pawn => pawn.x === x && pawn.y === y && pawn.color === color)
        }
        return pawns.find(pawn => pawn.x === x && pawn.y === y)
    }

    // Move logic - DOIT ÊTRE DÉFINI AVANT getMovementsOfPawn
    const movePawnTo = (ogPawn, x, y, pawns) => {
        const copyPawn = { ...ogPawn }
        const originalPawns = [...pawns] // Copie pour éviter mutation

        // Clean enPassant property for all pawns
        originalPawns.forEach(pawn => {
            delete pawn.enPassant
        })
        const front = getFront(ogPawn.color)

        // Remove original pawn
        let newPawns = originalPawns.filter(pawn => !(pawn.x === ogPawn.x && pawn.y === ogPawn.y))

        // En passant logic - set flag if pawn moves 2 squares
        if (ogPawn.name === 'pawn' && Math.abs(y - ogPawn.y) === 2) {
            copyPawn.enPassant = true
        }

        // En passant capture - remove captured pawn
        if (ogPawn.name === 'pawn') {
            const enPassantTarget = isAPawn(newPawns, x, y - front, otherColor(ogPawn.color))
            if (enPassantTarget && enPassantTarget.hasOwnProperty('enPassant')) {
                newPawns = newPawns.filter(pawn => !(pawn.x === x && pawn.y === y - front))
            }
        }

        // Remove piece at destination (normal capture)
        newPawns = newPawns.filter(pawn => !(pawn.x === x && pawn.y === y))

        // Promotion
        if (ogPawn.name === 'pawn') {
            if (ogPawn.color === 'white' && y === props.heightGame - 1) {
                copyPawn.name = 'queen'
            }
            if (ogPawn.color === 'black' && y === 0) {
                copyPawn.name = 'queen'
            }
        }

        // Add moved piece to new position
        newPawns = [...newPawns, { ...copyPawn, x, y }]
        return newPawns
    }

    // Check if king is in check
    const isKingInCheck = (pawns, colorOfTheKing) => {
        const king = pawns.find(pawn => pawn.name === 'king' && pawn.color === colorOfTheKing)
        if (!king) {
            return false
        }

        const otherColorPawns = pawns.filter(pawn => pawn.color !== colorOfTheKing)

        // Get all attack squares from opponent pieces
        let opponentAttackSquares = []
        for (let pawn of otherColorPawns) {
            const { tempEatSquares } = getMovementsOfPawn(pawns, pawn, false) // false = don't check for checks (avoid infinite recursion)
            opponentAttackSquares = [...opponentAttackSquares, ...tempEatSquares]
        }

        // Remove duplicates
        opponentAttackSquares = opponentAttackSquares.filter((square, index) =>
            opponentAttackSquares.findIndex(s => s.x === square.x && s.y === square.y) === index
        )

        return opponentAttackSquares.some(square => square.x === king.x && square.y === king.y)
    }

    // Filter movements that would put own king in check
    const filterLegalMoves = (pawn, movements, pawns) => {
        if (rule !== 'normal') {
            return movements
        }

        return movements.filter(movement => {
            const newPawns = movePawnTo(pawn, movement.x, movement.y, [...pawns])
            return !isKingInCheck(newPawns, pawn.color)
        })
    }

    // Core game logic - calculate piece movements
    const getMovementsOfPawn = (pawns, pawn, checkForChecks = true) => {
        const front = getFront(pawn.color)
        const turn = pawn.color
        let { x, y } = pawn
        let movements = []

        switch (pawn.name) {
            case 'pawn':
                if (!isAPawn(pawns, x, y + front)) {
                    movements.push('one forward')
                    if (((y === 1 && pawn.color === 'white') ||
                        (y === props.heightGame - 2 && pawn.color === 'black')) &&
                        !isAPawn(pawns, x, y + 2 * front)) {
                        movements.push('two forward')
                    }
                }
                if (isAPawn(pawns, x + 1, y + front, otherColor(turn))) {
                    movements.push('front right')
                }
                if (isAPawn(pawns, x - 1, y + front, otherColor(turn))) {
                    movements.push('front left')
                }
                // En passant
                const rightPawn = isAPawn(pawns, x + 1, y, otherColor(turn))
                if (rightPawn && rightPawn.hasOwnProperty('enPassant')) {
                    movements.push('en passant right')
                }
                const leftPawn = isAPawn(pawns, x - 1, y, otherColor(turn))
                if (leftPawn && leftPawn.hasOwnProperty('enPassant')) {
                    movements.push('en passant left')
                }
                break
            case 'queen':
                movements = ['+', 'x']
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

        // Process basic pawn movements
        if (movements.includes('one forward')) {
            tempPreviewSquares.push({ x, y: y + front })
        }
        if (movements.includes('two forward')) {
            tempPreviewSquares.push({ x, y: y + 2 * front })
        }
        if (movements.includes('front right')) {
            tempEatSquares.push({ x: x + 1, y: y + front })
        }
        if (movements.includes('front left')) {
            tempEatSquares.push({ x: x - 1, y: y + front })
        }
        if (movements.includes('en passant right')) {
            tempEatSquares.push({ x: x + 1, y: y + front })
        }
        if (movements.includes('en passant left')) {
            tempEatSquares.push({ x: x - 1, y: y + front })
        }

        // Rook-like movements (+)
        if (movements.includes('+')) {
            // Right
            for (let i = 1; i + x < props.widthGame; i++) {
                const foundPawn = isAPawn(pawns, x + i, y)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x + i, y })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x + i, y })
                    }
                    break
                }
            }
            // Left
            for (let i = 1; x - i >= 0; i++) {
                const foundPawn = isAPawn(pawns, x - i, y)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x - i, y })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x - i, y })
                    }
                    break
                }
            }
            // Up
            for (let i = 1; i + y < props.heightGame; i++) {
                const foundPawn = isAPawn(pawns, x, y + i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x, y: y + i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x, y: y + i })
                    }
                    break
                }
            }
            // Down
            for (let i = 1; y - i >= 0; i++) {
                const foundPawn = isAPawn(pawns, x, y - i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x, y: y - i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x, y: y - i })
                    }
                    break
                }
            }
        }

        // Bishop-like movements (x)
        if (movements.includes('x')) {
            // Bottom right
            for (let i = 1; i + y < props.heightGame && i + x < props.widthGame; i++) {
                const foundPawn = isAPawn(pawns, x + i, y + i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x + i, y: y + i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x + i, y: y + i })
                    }
                    break
                }
            }
            // Bottom left
            for (let i = 1; y + i < props.heightGame && x - i >= 0; i++) {
                const foundPawn = isAPawn(pawns, x - i, y + i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x - i, y: y + i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x - i, y: y + i })
                    }
                    break
                }
            }
            // Top left
            for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                const foundPawn = isAPawn(pawns, x - i, y - i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x - i, y: y - i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x - i, y: y - i })
                    }
                    break
                }
            }
            // Top right
            for (let i = 1; y - i >= 0 && x + i < props.widthGame; i++) {
                const foundPawn = isAPawn(pawns, x + i, y - i)
                if (!foundPawn) {
                    tempPreviewSquares.push({ x: x + i, y: y - i })
                } else {
                    if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: x + i, y: y - i })
                    }
                    break
                }
            }
        }

        // Knight movements (L)
        if (movements.includes('L')) {
            const knightMoves = [
                [2, 1], [2, -1], [-2, 1], [-2, -1],
                [1, 2], [1, -2], [-1, 2], [-1, -2]
            ]

            for (let [dx, dy] of knightMoves) {
                const newX = x + dx
                const newY = y + dy

                if (0 <= newX && newX < props.widthGame && 0 <= newY && newY < props.heightGame) {
                    const foundPawn = isAPawn(pawns, newX, newY)
                    if (!foundPawn) {
                        tempPreviewSquares.push({ x: newX, y: newY })
                    } else if (foundPawn.color !== turn) {
                        tempEatSquares.push({ x: newX, y: newY })
                    }
                }
            }
        }

        // King movements (square)
        if (movements.includes('square')) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue

                    const newX = x + i
                    const newY = y + j

                    if (0 <= newX && newX < props.widthGame && 0 <= newY && newY < props.heightGame) {
                        const foundPawn = isAPawn(pawns, newX, newY)
                        if (!foundPawn) {
                            tempPreviewSquares.push({ x: newX, y: newY })
                        } else if (foundPawn.color !== turn) {
                            tempEatSquares.push({ x: newX, y: newY })
                        }
                    }
                }
            }
        }

        // Apply legal move filtering for normal chess rules
        if (checkForChecks && rule === 'normal') {
            tempPreviewSquares = filterLegalMoves(pawn, tempPreviewSquares, pawns)
            tempEatSquares = filterLegalMoves(pawn, tempEatSquares, pawns)
        }

        return { tempPreviewSquares, tempEatSquares }
    }

    // Check if a player has any legal moves
    const hasLegalMoves = (color, pawns) => {
        const colorPawns = pawns.filter(pawn => pawn.color === color)

        for (let pawn of colorPawns) {
            const { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(pawns, pawn, true)
            if (tempEatSquares.length > 0 || tempPreviewSquares.length > 0) {
                return true
            }
        }
        return false
    }

    // UI helper functions
    const writePawns = (x, y, game) => {
        const pawn = game.pawns.find(pawn => pawn.x === x && pawn.y === y)
        if (pawn) {
            return <div className="pawn"><img src={`/${pawn.color}_${pawn.name}.webp`} alt={`${pawn.color} ${pawn.name}`} /></div>
        }
    }

    const isSelected = (x, y) => {
        return clickedSquare && clickedSquare.y === y && clickedSquare.x === x
    }

    const isTrajectory = (x, y) => {
        return previewSquares.some(square => square.x === x && square.y === y)
    }

    const isAnEatenSquare = (x, y) => {
        return eatSquares.some(square => square.x === x && square.y === y)
    }

    const setHelpEmplacement = (x, y) => {
        if (!props.showCoordonnates) return

        const writeOnSide = x === 0
        const writeOnLastLine = y === 0

        if (writeOnSide || writeOnLastLine) {
            return (
                <div className='helpSquare'>
                    {writeOnLastLine && <p className='letterPosition'>{String.fromCharCode(x + 97)}</p>}
                    {writeOnSide && <p className='numberPosition'>{y + 1}</p>}
                </div>
            )
        }
    }

    const clickOnSquare = (x, y) => {
        if (!props.movable || currentGame.winner) return

        // Check for missing kings in normal mode
        if (rule === 'normal') {
            const whiteKings = currentGame.pawns.filter(pawn => pawn.name === 'king' && pawn.color === 'white').length
            const blackKings = currentGame.pawns.filter(pawn => pawn.name === 'king' && pawn.color === 'black').length

            if (whiteKings !== 1 || blackKings !== 1) {
                alert('A king is missing, the game cannot start')
                return
            }
        }

        // Unselect if clicking same square
        if (clickedSquare && clickedSquare.x === x && clickedSquare.y === y) {
            setClickedSquare(null)
            setPreviewSquares([])
            setEatSquares([])
            return
        }

        // Check if clicked square is a valid move
        const isValidMove = [...previewSquares, ...eatSquares].some(square => square.x === x && square.y === y)

        if (isValidMove && clickedSquare) {
            // Make the move
            const pawn = isAPawn(currentGame.pawns, clickedSquare.x, clickedSquare.y)
            const newPawns = movePawnTo(pawn, x, y, [...currentGame.pawns])

            // Clear selection
            setClickedSquare(null)
            setEatSquares([])
            setPreviewSquares([])

            // Update game state
            setPawns(newPawns)
            const newTurn = currentGame.turn === 'white' ? 'black' : 'white'
            setTurn(newTurn)

            // Check game end conditions
            const opponentHasMoves = hasLegalMoves(newTurn, newPawns)

            if (!opponentHasMoves) {
                if (rule === 'normal') {
                    const kingInCheck = isKingInCheck(newPawns, newTurn)
                    if (kingInCheck) {
                        // Checkmate - current player wins
                        setWinner(currentGame.turn)
                    } else {
                        // Stalemate - draw
                        setWinner('draw')
                    }
                } else if (rule === 'giveaway') {
                    // In giveaway, losing all moves means you win
                    setWinner(newTurn)
                }
            }
        } else {
            // Select new square
            setClickedSquare({ x, y })
        }
    }

    const setEveryPreviewSquare = (x, y) => {
        const pawn = currentGame.pawns.find(pawn => pawn.x === x && pawn.y === y)

        if (!pawn || pawn.color !== currentGame.turn) {
            setPreviewSquares([])
            setEatSquares([])
            return
        }

        const { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(currentGame.pawns, pawn, true)

        // Apply giveaway rule if needed
        if (rule === 'giveaway' && tempEatSquares.length > 0) {
            setPreviewSquares([]) // Must capture if possible
        } else {
            setPreviewSquares(tempPreviewSquares)
        }

        setEatSquares(tempEatSquares)
    }

    // Update preview when square clicked
    useEffect(() => {
        if (clickedSquare) {
            setEveryPreviewSquare(clickedSquare.x, clickedSquare.y)
        }
    }, [clickedSquare])

    // Render the chess board
    return (
        <div className='chessGame'>
            {[...Array(props.heightGame)].map((_, indexRow) => {
                const invertedIndexRow = props.heightGame - 1 - indexRow
                return (
                    <div className='rows' key={indexRow}>
                        {[...Array(props.widthGame)].map((_, indexColumn) => (
                            <div
                                className={`squares ${(invertedIndexRow + indexColumn) % 2 === 0 ? 'even' : 'odd'} ${isSelected(indexColumn, invertedIndexRow) ? 'selected' : ''} 
                                    ${isTrajectory(indexColumn, invertedIndexRow) ? 'trajectory' : ''}
                                    ${isAnEatenSquare(indexColumn, invertedIndexRow) ? 'canBeTaken' : ''}
                                `}
                                key={indexColumn}
                                style={{ height: `${props.sizeSquare}px`, width: `${props.sizeSquare}px` }}
                                onClick={() => clickOnSquare(indexColumn, invertedIndexRow)}
                            >
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