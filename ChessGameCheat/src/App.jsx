import { useEffect, useState } from 'react'
import { contractGame, decontractGame } from './concatGame'
import { getByteSize } from './test';
import FCGame from './FuncComps/FCGame';

function App() {



  const heightGame = 8;
  const widthGame = 8;
  const sizeSquare = 60;

  //Create white pawns first 

  let normalGame = [
    { x: 0, y: 0, color: 'white', name: 'rook' },
    { x: 7, y: 0, color: 'white', name: 'rook' },
    { x: 2, y: 0, color: 'white', name: 'bishop' },
    { x: 5, y: 0, color: 'white', name: 'bishop' },
    { x: 1, y: 0, color: 'white', name: 'knight' },
    { x: 6, y: 0, color: 'white', name: 'knight' },
    { x: 3, y: 0, color: 'white', name: 'king' },
    { x: 4, y: 0, color: 'white', name: 'queen' },
  ]

  for (let i = 0; i < widthGame; i++) {
    normalGame.push({ x: i, y: 1, color: 'white', name: 'pawn' })
  }


  const lengthNormalGame = normalGame.length
  for (let i = 0; i < lengthNormalGame; i++) {
    normalGame.push({
      x: normalGame[i].x,
      y: heightGame - 1 - normalGame[i].y,
      color: normalGame[i].color == 'white' ? 'black' : 'white',
      name: normalGame[i].name
    })
  }


  const [winner, setWinner] = useState(null)


  const [clickedSquare, setClickedSquare] = useState(null)
  const [previewSquares, setPreviewSquares] = useState([])
  const [eatSquares, setEatSquares] = useState([])
  const [currentGame, setCurrentGame] = useState({
    pawns: [
      { name: 'pawn', x: 0, y: 3, color: 'white' },
      { name: 'pawn', x: 0, y: 5, color: 'white' },
      { name: 'pawn', x: 6, y: 5, color: 'black' },
      { name: 'pawn', x: 1, y: 5, color: 'black' }
    ],
    turn: 'white',
    winner: null
  })



  const [incomingMovements, setIncomingMovements] = useState([])


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
      if (ogPawn.color == 'white' && y == heightGame - 1) {
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
            (y == heightGame - 2 && pawn.color == 'black'))
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
      for (let i = 1; i + x < widthGame; i++) {
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
      for (let i = 1; i + y < heightGame; i++) {
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
      for (let i = 1; i + y < heightGame && i + x < heightGame; i++) {
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
      for (let i = 1; y + i < heightGame && x - i >= 0; i++) {
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
          if (0 <= newX && newX < widthGame && 0 <= newY && newY < heightGame) {
            tempPreviewSquares.push({ x: newX, y: newY })
          }
        }
      }
    }

    //change the preview square where there is a pawn to eatSquares 

    tempEatSquares = [...tempEatSquares, ...tempPreviewSquares.filter(square => isAPawn(pawns, square.x, square.y))]
    tempPreviewSquares = tempPreviewSquares.filter(square => !isAPawn(pawns, square.x, square.y))
    return { tempPreviewSquares, tempEatSquares }
  }

  const aPawnCanMove = (color, pawns) => {
    const otherColorPawns = pawns.filter(pawn => pawn.color == color)
    if (otherColorPawns.length == 0) {
      return false
    }

    for (let pawn of otherColorPawns) {
      const { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(pawns, pawn)

      if (tempEatSquares.length > 0 || tempPreviewSquares.length > 0)
        return true
    }
    return false
  }

  const setEveryPreviewSquare = (x, y) => {
    const pawn = currentGame.pawns.find(pawn => pawn.x == x && pawn.y == y)
    if (!pawn || pawn.color != currentGame.turn) {
      setPreviewSquares([])
      return
    }

    const { tempEatSquares, tempPreviewSquares } = getMovementsOfPawn(currentGame.pawns, pawn)

    //if a pawn can be eaten by another pawn of the color's turn set tempPreviewSquares to empty
    if (tempEatSquares.length > 0 || aPawnCanBeEat(currentGame.pawns, currentGame.turn)) {
      tempPreviewSquares.length = 0
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

    if (!(0 <= x && x < widthGame && 0 <= y && y <= heightGame))
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


  const seeTheGameInXMovements = (x) => {
    // Keep the winning games in memory with the path 
    // Max of 1000 movements 
    // Keep the other turn games in memory 

    const preventInfiniteLoop = 30
    let games = [currentGame]
    let otherTurnGame = []
    for (let i = 0; i < x; i++) {

      if (i >= preventInfiniteLoop) {
        console.warn('Prevented infinite loop in seeTheGameInXMovements')
        return
      }
      //take every pawn 
      for (let game of games) {
        if (game.winner)
          continue //skip the game if it has a winner
        const canTake = aPawnCanBeEat(game.pawns, game.turn)

        for (let pawn of game.pawns) {
          if (pawn.color != game.turn)
            continue
          //if one pawn can eat, only play the tempEatSquares

          //take every movement of the pawn
          const { tempPreviewSquares, tempEatSquares } = getMovementsOfPawn(game.pawns, pawn)

          //make every movement and add it to a temporary game
          //if the pawn can eat, only take the eat squares
          let movingSquares = []
          if (tempEatSquares.length > 0) {
            movingSquares = tempEatSquares
          }
          else if (tempPreviewSquares.length > 0 && !canTake) {
            movingSquares = tempPreviewSquares
          }
          if (movingSquares.length > 0) {
            for (let movingSquare of movingSquares) {
              const newPawns = movePawnTo(pawn, movingSquare.x, movingSquare.y, game.pawns)
              if (!aPawnCanMove(otherColor(pawn.color), newPawns)) {
                otherTurnGame.push({ pawns: newPawns, turn: otherColor(pawn.color), winner: otherColor(pawn.color) })
              } else {
                otherTurnGame.push({ pawns: newPawns, turn: otherColor(pawn.color) })
              }
            }
          }

        }
        //here you got every possible movement of the pawns for the curret game
      }
      //here we got every possible games in x movements
      games = otherTurnGame

      //TODO: clean every double game


      setIncomingMovements(otherTurnGame)

      otherTurnGame = []
    }
  }

  const [futur, setFutur] = useState(1)


  useEffect(() => {
    seeTheGameInXMovements(futur)
    console.log(currentGame);
    
  }, [futur, currentGame])

  // useEffect(() => {
  //   getByteSize(incomingMovements, futur);
  // }, [incomingMovements])

  const myColor = 'white'

  useEffect(() => {
    console.log(currentGame);
  }, [currentGame])

  const arrows = [
    {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    }
  ]

  return (
    <div className='mainPage'>
      <div className='incomingMovements'>
        {incomingMovements.map((game, index) => (
          <div key={index}>{<FCGame
            sizeSquare={sizeSquare}
            heightGame={heightGame}
            widthGame={widthGame}
            game={game}
            showCoordonnates={false} />}</div>
        ))}
      </div>
      <h1>The quantity of movements : {incomingMovements.length}</h1>
      <input
        min={1}
        type="number"
        style={{ width: '50px', fontSize: 30 }}
        value={futur}
        onChange={(e) => setFutur(e.target.value)}
      />
      <h1 className='turn'>{winner ? `${winner} won !` : `${currentGame.turn == 'white' ? 'White' : 'Black'} turn`}</h1>
      <FCGame
        sizeSquare={sizeSquare}
        heightGame={heightGame}
        widthGame={widthGame}
        game={currentGame}
        showCoordonnates={true}
        changePropGame={setCurrentGame} />
    </div >
  )
}

export default App
