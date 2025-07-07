
function changeDigitToLetter(digit) {
    if (digit < 0 || digit > 25) {
        throw new Error('Digit must be between 0 and 25')
    }
    return String.fromCharCode(digit + 97)
}

export function decontractGame(txtGame) {
    const gameArr = txtGame.split('/')
    const turn = gameArr[0] == 'w' ? 'white' : 'black'
    const pawnsString = txtGame.slice(2) 
    console.log(txtGame, pawnsString);
    const pawns = pawnsString.split('/').map(pawn => {
        const x = parseInt(pawn[0])
        const y = pawn.charCodeAt(1) - 97 // Get the digit
        const color = pawn[2] == 'w' ? 'white' : 'black'
        let name
        switch (pawn[3]) {
            case 'r':
                name = 'rook'
                break;
            case 'b':
                name = 'bishop'
                break;
            case 'k':
                name = 'knight'
                break;
            case 'K':
                name = 'king'
                break;
            case 'q':
                name = 'queen'
                break;
            default:
                name = 'pawn'
        }
        const enPassant = pawn[4] == 'e'
        if (enPassant)
            return { x, y, color, name, enPassant: true }
        return { x, y, color, name }
    })
    return { turn, pawns }
}

export function contractGame(game) {
    const contractedPawns = game.pawns.map(pawn => (
        pawn.x + changeDigitToLetter(pawn.y) + pawn.color[0] + (pawn.name == 'king' ? pawn.name[0].toUpperCase() : pawn.name[0].toLowerCase()) +
        (pawn.enPassant ? 'e' : '')
    ))
    const txtGame = contractedPawns.join('/')
    return game.turn[0] + '/' + txtGame
}
