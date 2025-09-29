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



  const [currentGame, setCurrentGame] = useState({
    pawns: [
      { name: 'rook', x: 3, y: 5, color: 'white' },
      { name: 'king', x: 0, y: 5, color: 'white' },
      { name: 'king', x: 0, y: 7, color: 'black' },
      { name: "bishop", x: 5, y: 4, color: 'black'}
    ],
    turn: 'white',
    winner: null
  })


  // const seeTheGameInXMovements = (x) => {
  //   // Keep the winning games in memory with the path 
  //   // Max of 1000 movements 
  //   // Keep the other turn games in memory 
  //   console.log('search for ', currentGame.pawns.length);

  //   const preventInfiniteLoop = 30
  //   let games = [currentGame]
  //   let otherTurnGame = []
  //   for (let i = 0; i < x; i++) {

  //     if (i >= preventInfiniteLoop && games.length > 1000) {
  //       console.warn('Prevented infinite loop in seeTheGameInXMovements')
  //       return
  //     }
  //     //take every pawn 
  //     for (let game of games) {
  //       if (game.winner)
  //         continue //skip the game if it has a winner
  //       const canTake = aPawnCanBeEat(game.pawns, game.turn)

  //       for (let pawn of game.pawns) {
  //         if (pawn.color != game.turn)
  //           continue
  //         //if one pawn can eat, only play the tempEatSquares

  //         //take every movement of the pawn
  //         const { tempPreviewSquares, tempEatSquares } = getMovementsOfPawn(game.pawns, pawn)

  //         //make every movement and add it to a temporary game
  //         //if the pawn can eat, only take the eat squares
  //         let movingSquares = []
  //         if (tempEatSquares.length > 0) {
  //           movingSquares = tempEatSquares
  //         }
  //         else if (tempPreviewSquares.length > 0 && !canTake) {
  //           movingSquares = tempPreviewSquares
  //         }
  //         if (movingSquares.length > 0) {
  //           for (let movingSquare of movingSquares) {
  //             const newPawns = movePawnTo(pawn, movingSquare.x, movingSquare.y, game.pawns)
  //             if (!aPawnCanMove(otherColor(pawn.color), newPawns)) {
  //               otherTurnGame.push({ pawns: newPawns, turn: otherColor(pawn.color), winner: otherColor(pawn.color) })
  //             } else {
  //               otherTurnGame.push({ pawns: newPawns, turn: otherColor(pawn.color) })
  //             }
  //           }
  //         }

  //       }
  //       //here you got every possible movement of the pawns for the curret game
  //     }
  //     //here we got every possible games in x movements
  //     games = otherTurnGame

  //     //TODO: clean every double game

  //     console.log('set');

  //     setIncomingMovements([...otherTurnGame, currentGame])
  //     otherTurnGame = []
  //   }

  // }

  const [futur, setFutur] = useState(1)

  const myColor = 'white'

  const arrows = [
    {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 }
    }
  ]


  const colors = [
    'white', 'black'
  ]

  return (
    <div className='mainPage'>
      <h1 className='turn'>{currentGame.winner ? currentGame.winner == 'draw' ? 'Draw' : `${currentGame.winner} won !` : `${currentGame.turn == 'white' ? 'White' : 'Black'} turn`}</h1>

      <FCGame
        sizeSquare={sizeSquare}
        heightGame={heightGame}
        widthGame={widthGame}
        game={currentGame}
        showCoordonnates={true}
        movable={true}
        rule={'normal'}
        changePropGame={setCurrentGame} />
    </div >
  )
}

export default App
