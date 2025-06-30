export function compareGame(firstGame, secondGame) {
    const tempFirstGame = JSON.stringify(firstGame)
    const tempSecondGame = JSON.stringify(secondGame)

    if (tempFirstGame == tempSecondGame) {
        return true;
    }

    if (firstGame.turn !== secondGame.turn) {
        return { status: false, reason: 'Turn mismatch' };
    }

    if (firstGame.pawns.length !== secondGame.pawns.length) {
        return { status: false, reason: 'Not same length' };
    }

    firstGame.pawns.forEach((pawn) => {
        const secondPawn = secondGame.pawns.find(p =>
            p.x === pawn.x &&
            p.y === pawn.y &&
            p.color === pawn.color &&
            p.name === pawn.name &&
            p.enPassant === pawn.enPassant
        );
        if (!secondPawn) {
            return { status: false, reason: 'Not same content' };
        }
    })

    return false;
}



export function getByteSize(obj, movements) {
    const str = JSON.stringify(obj); 
    const blob = new Blob([str]);
    console.log(`${blob.size} octets - ${blob.size/1048} Mo - ${blob.size/1048/1048} Go for ${movements} movement`);
    return;                
}