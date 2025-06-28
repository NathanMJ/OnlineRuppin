import { use, useEffect, useState } from 'react'

function App() {
  /*
  TODO:
    the king can not move to a square where it can be eaten by a pawn of the other color
    a pawn can not move if it would put the king in check
    if the king is in check, the player must move the king or a pawn to block the check
    if the king is in check and there is no way to block the check or move the king, the player loses
  */

  const normalGame = []

  const heightGame = 8;
  const widthGame = 8;
  const sizeSquare = 80;

  const [turn, setTurn] = useState('white')
  const [front, setFront] = useState(turn == 'white' ? 1 : -1)

  const [clickedSquare, setClickedSquare] = useState(null)
  const [previewSquares, setPreviewSquares] = useState([])
  const [eatSquares, setEatSquares] = useState([])
  const [game, setGame] = useState([{
    name: 'pawn',
    color: 'black',
    x: 7,
    y: 3
  }])

  useEffect(() => {
    if (clickedSquare) {
      const pawn = isAPawn(clickedSquare.x, clickedSquare.y)
      if (pawn)
        console.log('pawn clicked:', pawn);
    }
  }, [clickedSquare])

  useEffect(() => {
    setFront(Math.pow(-1, turn == 'white' ? 0 : 1))
  }, [turn])



  const clickOnSquare = (x, y) => {
    if (clickedSquare && clickedSquare.x == x && clickedSquare.y == y) {
      setClickedSquare(null)
      setPreviewSquares([])
      setEatSquares([])
      return
    }
    //if the square is selected move the pawn to the square
    const isSelected = [...previewSquares, ...eatSquares].some(square => square.x == x && square.y == y)
    if (isSelected) {
      game.forEach(pawn => {
        delete pawn.enPassant
      })
      movePawnTo(x, y)
    }
    else {
      setClickedSquare({ x, y })
      setEatSquares([])
    }
  }

  const movePawnTo = (x, y) => {

    let newGame = game
    //find the pawn
    const pawnIndex = newGame.findIndex(pawn => pawn.x == clickedSquare.x && pawn.y == clickedSquare.y)
    //remove the pawn
    let [ogPawn] = newGame.splice(pawnIndex, 1)
    //if the pawn is a pawn and the square to go is two squares forward, set the en passant property
    if (ogPawn.name == 'pawn' && Math.abs(y - clickedSquare.y) == 2) {
      ogPawn.enPassant = true
    }
    //if the pawn is a pawn and the square before is a pawn of the other color remove it
    if (ogPawn.name == 'pawn' && isAPawn(x, y - front, otherColor(turn))) {
      console.log(`removing pawn at ${x}, ${y - front}`);
      newGame = newGame.filter(pawn => !(pawn.x == x && pawn.y == y - front))
    }
    //remove the new location
    newGame = newGame.filter(pawn => !(pawn.x == x && pawn.y == y))
    //insert the pawn with the new location
    if (ogPawn.name == 'pawn') {
      if (ogPawn.color == 'white' && y == 0) {
        ogPawn.name = 'queen'
      }
      if (ogPawn.color == 'black' && y == heightGame - 1) {
        ogPawn.name = 'queen'
      }
    }
    console.log(ogPawn);
    newGame = [...newGame, { ...ogPawn, x, y }]
    console.log(newGame);
    setGame(newGame)
    setClickedSquare()
    setEatSquares([])
    setPreviewSquares([])
    setTurn(turn == 'white' ? 'black' : 'white')
    return
  }


  useEffect(() => {
    if (clickedSquare) {
      setEveryPreviewSquare(clickedSquare.x, clickedSquare.y)
    }
  }, [clickedSquare])

  const setEveryPreviewSquare = (x, y) => {
    const pawn = game.find(pawn => pawn.x == x && pawn.y == y)
    if (!pawn || pawn.color != turn) {
      setPreviewSquares([])
      return
    }

    // movements = ['one forward', '+', 'square', 'X', 'L', 'front left', 'front right']

    let movements = []

    switch (pawn.name) {
      case 'pawn':
        if (!isAPawn(x, y + front)) {
          movements = ['one forward']
        }
        if (y == 1 && !isAPawn(x, y + 2 * (front))) {
          movements.push('two forward')
        }
        if (isAPawn(x + 1, y + front, otherColor(turn))) {
          movements.push('front right')
        }
        if (isAPawn(x - 1, y + front, otherColor(turn))) {
          movements.push('front left')
        }
        if (isAPawn(x + 1, y, otherColor(turn))?.hasOwnProperty('enPassant')) {
          movements.push('en passant right')
        }
        if (isAPawn(x - 1, y, otherColor(turn))?.hasOwnProperty('enPassant')) {
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
        const pawn = isAPawn(x + i, y)
        console.log({ x: x + i, y });
        if (!pawn) {
          tempPreviewSquares.push({ x: x + i, y })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x: x + i, y })
          }
          break;
        }
      }
      //left side
      for (let i = 1; x - i >= 0; i++) {
        const pawn = isAPawn(x - i, y)
        console.log({ x: x - i, y });
        if (!pawn) {
          tempPreviewSquares.push({ x: x - i, y })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x: x - i, y })
          }
          break;
        }
      }

      //top side
      for (let i = 1; i + y < heightGame; i++) {
        const pawn = isAPawn(x, y + i)
        if (!pawn) {
          tempPreviewSquares.push({ x, y: y + i })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x, y: y + i })
          }
          break;
        }
      }
      //bottom side
      for (let i = 1; y - i >= 0; i++) {
        const pawn = isAPawn(x, y - i)
        if (!pawn) {
          tempPreviewSquares.push({ x: x, y: y - i })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x, y: y - i })
          }
          break;
        }
      }
    }
    if (movements.includes('x')) {
      //botton right side
      for (let i = 1; i + y < heightGame && i + x < heightGame; i++) {
        const pawn = isAPawn(x + i, y + i)
        if (!pawn) {
          tempPreviewSquares.push({ x: x + i, y: y + i })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x: x + i, y: y + i })
          }
          break;
        }
      }
      //botton left side
      for (let i = 1; y + i < heightGame && x - i >= 0; i++) {
        const pawn = isAPawn(x - i, y + i)
        if (!pawn) {
          tempPreviewSquares.push({ x: x - i, y: y + i })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x: x - i, y: y + i })
          }
          break;
        }
      }
      //top left side
      for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
        const pawn = isAPawn(x - i, y - i)
        if (!pawn) {
          tempPreviewSquares.push({ x: x - i, y: y - i })
        }
        else {
          if (pawn.color != turn) {
            tempPreviewSquares.push({ x: x - i, y: y - i })
          }
          break;
        }
      }
      //top right side
      for (let i = 1; y - i >= 0 && x + i >= 0; i++) {
        const pawn = isAPawn(x + i, y - i)
        if (!pawn) {
          tempPreviewSquares.push({ x: x + i, y: y - i })
        }
        else {
          if (pawn.color != turn) {
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
            if (!isAPawn(newX, newY, turn))
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
          if (isAPawn(newX, newY, turn)) continue // skip if there is a pawn of the same color
          if (0 <= newX && newX < widthGame && 0 <= newY && newY < heightGame) {
            tempPreviewSquares.push({ x: newX, y: newY })
          }
        }
      }
    }
    //change the preview square where there is a pawn to eatSquares 

    tempEatSquares = [...tempEatSquares, ...tempPreviewSquares.filter(square => isAPawn(square.x, square.y))]
    tempPreviewSquares = tempPreviewSquares.filter(square => !isAPawn(square.x, square.y))

    setPreviewSquares(tempPreviewSquares)
    setEatSquares(tempEatSquares)
  }

  const isAPawn = (x, y, color) => {
    if (!(0 <= x && x < widthGame && 0 <= y && y <= heightGame))
      return false
    if (color) {
      return game.find(pawn => pawn.x == x && pawn.y == y && pawn.color == color)
    }
    return game.find(pawn => pawn.x == x && pawn.y == y)
  }

  const otherColor = (color) => {
    if (color == 'white')
      return 'black'
    else if (color == 'black')
      return 'white'
    return null
  }

  const setHelpEmplacement = (x, y) => {
    const help = true
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
  const setPawns = (x, y) => {
    const pawn = game.find(pawns => pawns.x == x && pawns.y == y)
    if (pawn) {
      return <div className={`pawn`}><img src={`/${pawn.color}_${pawn.name}.webp`}></img></div >
    }
  }

  return (
    <div className='mainPage'>
      <h1 className='turn'>{turn == 'white' ? 'White' : 'Black'} turn</h1>
      <div className='chessGame'>
        {[...Array(heightGame)].map((_, indexRow) => {
          const invertedIndexRow = heightGame - 1 - indexRow
          return (
            <div className='rows' key={indexRow}>
              {[...Array(widthGame)].map((_, indexColumn) => (
                <div className={`squares ${(invertedIndexRow + indexColumn) % 2 == 0 ? 'even' : 'odd'} ${isSelected(indexColumn, invertedIndexRow) ? 'selected' : ''} 
              ${isTrajectory(indexColumn, invertedIndexRow) && 'trajectory'}
                ${isAnEatenSquare(indexColumn, invertedIndexRow) && 'canBeTaken'}
              `}
                  key={indexColumn}
                  style={{ height: `${sizeSquare}px`, width: `${sizeSquare}px` }}
                  onClick={() => { clickOnSquare(indexColumn, invertedIndexRow) }}>
                  {setHelpEmplacement(indexColumn, invertedIndexRow)}
                  {setPawns(indexColumn, invertedIndexRow)}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
