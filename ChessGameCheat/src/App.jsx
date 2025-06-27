import { use, useEffect, useState } from 'react'

function App() {
  /*
  TODO:
    we can eat your own pawn
    set red color to the pawn you can take
  */

  const heightGame = 8;
  const widthGame = 8;
  const sizeSquare = 80;

  const [turn, setTurn] = useState('white')
  const [clickedSquare, setClickedSquare] = useState(null)
  const [previewSquares, setPreviewSquares] = useState([])
  const [eatSquares, setEatSquares] = useState([])
  const [game, setGame] = useState([
    {
      name: 'pawn',
      color: 'white',
      x: 0,
      y: 5
    }, {
      name: 'knight',
      color: 'black',
      x: 1,
      y: 5
    }, {
      name: 'knight',
      color: 'white',
      x: 2,
      y: 5
    }, {
      name: 'pawn',
      color: 'white',
      x: 5,
      y: 3
    }, {
      name: 'pawn',
      color: 'black',
      x: 1,
      y: 4
    }, {
      name: 'pawn',
      color: 'black',
      x: 6,
      y: 3,
      enPassant: true
    }, {
      name: 'pawn',
      color: 'white',
      x: 6,
      y: 6
    }, {
      name: 'pawn',
      color: 'black',
      x: 6,
      y: 5
    }, {
      name: 'rook',
      color: 'black',
      x: 4,
      y: 4
    }, {
      name: 'rook',
      color: 'white',
      x: 4,
      y: 6
    }, {
      name: 'pawn',
      color: 'white',
      x: 7,
      y: 3
    }, {
      name: 'queen',
      color: 'white',
      x: 0,
      y: 0
    }, {
      name: 'queen',
      color: 'white',
      x: 0,
      y: 7
    }, {
      name: 'queen',
      color: 'white',
      x: 7,
      y: 7
    }, {
      name: 'queen',
      color: 'white',
      x: 7,
      y: 0
    }, {
      name: 'queen',
      color: 'black',
      x: 3,
      y: 4
    }, {
      name: 'bishop',
      color: 'black',
      x: 1,
      y: 1
    }, {
      name: 'bishop',
      color: 'white',
      x: 1,
      y: 2
    }
  ])

  const clickOnSquare = (x, y) => {
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
        if (pawn.color == 'white') {
          if (!isAPawn(x, y - 1)) {
            movements = ['one forward']
          }
          if (y == widthGame - 2 && !isAPawn(x, y - 2)) {
            movements.push('two forward')
          }
          if (isAPawn(x + 1, y - 1, 'black')) {
            movements.push('front right')
          }
          if (isAPawn(x - 1, y - 1, 'black')) {
            movements.push('front left')
          }
          if (isAPawn(x + 1, y, 'black')?.hasOwnProperty('enPassant')) {
            movements.push('en passant right')
          }
          if (isAPawn(x - 1, y, 'black')?.hasOwnProperty('enPassant')) {
            movements.push('en passant left')
          }
        }
        else if (pawn.color == 'black') {
          if (!isAPawn(x, y + 1)) {
            movements = ['one forward']
          }
          if (y == 1 && !isAPawn(x, y + 2)) {
            movements.push('two forward')
          }
          if (isAPawn(x - 1, y + 1, 'white')) {
            movements.push('front right')
          }
          if (isAPawn(x + 1, y + 1, 'white')) {
            movements.push('front left')
          }
          if (isAPawn(x - 1, y, 'white')?.hasOwnProperty('enPassant')) {
            movements.push('en passant right')
          }
          if (isAPawn(x + 1, y, 'white')?.hasOwnProperty('enPassant')) {
            movements.push('en passant left')
          }
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
    }


    let tempPreviewSquares = []
    let tempEatSquares = []
    if (pawn.color == 'white') {
      if (movements.some(movement => movement == 'one forward')) {
        tempPreviewSquares.push({ x, y: y - 1 })
        if (movements.some(movement => movement == 'two forward')) {
          tempPreviewSquares.push({ x, y: y - 2 })
        }
      }
      if (movements.some(movement => movement == 'front right')) {
        tempPreviewSquares.push({ x: x + 1, y: y - 1 })
      }
      if (movements.some(movement => movement == 'en passant right')) {
        tempEatSquares.push({ x: x + 1, y: y - 1 })
      }
      if (movements.some(movement => movement == 'front left')) {
        tempPreviewSquares.push({ x: x - 1, y: y - 1 })
      }
      if (movements.some(movement => movement == 'en passant left')) {
        tempEatSquares.push({ x: x - 1, y: y - 1 })
      }
    }
    else if (pawn.color == 'black') {
      if (movements.some(movement => movement == 'one forward')) {
        tempPreviewSquares.push({ x, y: y + 1 })
        if (movements.some(movement => movement == 'two forward')) {
          tempPreviewSquares.push({ x, y: y + 2 })
        }
      }
      if (movements.some(movement => movement == 'front right' || movement == 'en passant right')) {
        tempPreviewSquares.push({ x: x - 1, y: y + 1 })
      }
      if (movements.some(movement => movement == 'front left' || movement == 'en passant left')) {
        tempPreviewSquares.push({ x: x + 1, y: y + 1 })
      }
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
      for (let a = 1, b = (a == 1 ? 2 : 1); a <= 2; a++) {
        for (let c = 1; c <= 2; c++)
          for (let d = 1; d <= 2; d++) {
            tempPreviewSquares.push({ x: x + a * Math.pow(-1, c), y: y + b * Math.pow(-1, d) })

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

  const setHelpEmplacement = (x, y) => {
    const help = true
    if (!help)
      return
    let writeOnSide = x == 0
    let writeOnLastLine = y == widthGame - 1
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
        {[...Array(heightGame)].map((_, indexRow) => (
          <div className='rows' key={indexRow}>
            {[...Array(widthGame)].map((_, indexColumn) => (
              <div className={`squares ${(indexRow + indexColumn) % 2 == 0 ? 'even' : 'odd'} ${isSelected(indexColumn, indexRow) ? 'selected' : ''} 
              ${isTrajectory(indexColumn, indexRow) && 'trajectory'}
                ${isAnEatenSquare(indexColumn, indexRow) && 'canBeTaken'}
              `}
                key={indexColumn}

                style={{ height: `${sizeSquare}px`, width: `${sizeSquare}px` }}
                onClick={() => { clickOnSquare(indexColumn, indexRow) }}>
                {setHelpEmplacement(indexColumn, indexRow)}
                {setPawns(indexColumn, indexRow)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
