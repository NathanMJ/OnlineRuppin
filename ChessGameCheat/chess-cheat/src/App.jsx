import { use, useEffect, useState } from 'react'

function App() {
  const heightGame = 8;
  const widthGame = 8;
  const sizeSquare = 70;

  const [clickedSquare, setClickedSquare] = useState(null)
  const [previewSquares, setPreviewSquares] = useState([])
  const [game, setGame] = useState([
    {
      name: 'pawn',
      color: 'white',
      x: 0,
      y: 6
    }
  ])

  const clickOnSquare = (indexColumn, indexRow) => {
    setClickedSquare({ x: indexColumn, y: indexRow })
  }


  useEffect(() => {
    if (clickedSquare) {
      setEveryPreviewSquare(clickedSquare.x, clickedSquare.y)
    }
  }, [clickedSquare])


  useEffect(() => {
    console.log(previewSquares);
  }, [previewSquares])

  const setEveryPreviewSquare = (x, y) => {

    if (x == undefined || y == undefined) {
      setPreviewSquares([])
      return
    }
    const pawn = game.find(pawn => pawn.x == x && pawn.y == y)
    if (!pawn)
      return
    // movements = ['one forward', 'two forward', 'horizontal',
    //    'vertical', 'square' ]
    let movements = []
    switch (pawn.name) {
      case 'pawn':
        movements = ['one forward']
        if (true) {
          movements.push('two forward')
        }
    }


    let tempPreviewSquares = []
    //write placement
    console.log(pawn.name);

    if (movements.some(movement => movement == 'one forward')) {
      if (y > 0) {
        tempPreviewSquares.push({ x, y: y - 1 })
      }
    }

    if (movements.some(movement => movement == 'two forward')) {
      if (y > 1) {
        tempPreviewSquares.push({ x, y: y - 2 })
      }
    }

    setPreviewSquares(tempPreviewSquares)
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
  const setPawns = (x, y) => {
    const exist = game.find(pawns => pawns.x == x && pawns.y == y)
    if (exist) {
      return <div className={`pawn ${exist.color}`}>{exist.name}</div>
    }
  }

  return (
    <div className='mainPage'>
      <div className='chessGame'>
        {[...Array(heightGame)].map((_, indexRow) => (
          <div className='rows' key={indexRow}>
            {[...Array(widthGame)].map((_, indexColumn) => (
              <div className={`squares ${(indexRow + indexColumn) % 2 == 0 ? 'even' : 'odd'} ${isSelected(indexColumn, indexRow) ? 'selected' : ''} ${isTrajectory(indexColumn, indexRow) ? 'trajectory' : ''}`} key={indexColumn}
                style={{ height: `${sizeSquare}px`, width: `${sizeSquare}px` }}
                onClick={() => clickOnSquare(indexColumn, indexRow)}>
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
