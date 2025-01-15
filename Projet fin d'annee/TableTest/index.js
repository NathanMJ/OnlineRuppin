let count = 1;

addEventListener('mousemove', (event) => {
    let x = event.clientX;
    let y = event.clientY;

    document.querySelector('#positionX').innerHTML = x;
    document.querySelector('#positionY').innerHTML = y;
})

document.querySelector('#addTable').addEventListener('click', (event) => {
    event.preventDefault()
    if (document.querySelector('#addTable').classList.contains('clickedButton')) {
        alert('not possible')
        return
    }

    let content = document.querySelector('#restaurant').innerHTML;
    content += `
        <div id="table_${count - 1}" class="table">
            <p>${count}</p>
            <img src="./Pictures/Table.png">
        </div>`;
    document.querySelector('#restaurant').innerHTML = content;

    // document.querySelector('#restaurant').style.top = `${window.}`

    let isDragging = false;

    const table = document.querySelector(`#table_${count - 1}`);

    if (table) {
        table.addEventListener('mousedown', (event) => {

            if (document.querySelector('#moveTable').classList != 'clickedButton') {
                alert('not possible')
                return
            }
            isDragging = true;
        });

        // Détecter le mouvement de la souris
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                let x = event.clientX;
                let y = event.clientY;

                table.style.left = `${x}px`;
                table.style.top = `${y}px`;
            }
        });

        // Arrêter de déplacer lorsque le bouton de la souris est relâché
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }


    count++;
})

document.querySelector('#moveTable').addEventListener('click', (event) => {
    event.preventDefault()
    if (document.querySelector('#moveTable').classList != 'clickedButton') {
        //enable

        //the buttons change
        document.querySelector('#moveTable').classList.add('clickedButton')
        document.querySelector('#addTable').classList.add('clickedButton')

        //the tables can move now
        document.querySelectorAll('.table').forEach(element => {
            element.classList.add('movingTable')
        })

        //movingTable
    }
    else {
        //disable

        //the buttons change
        document.querySelector('#moveTable').classList.remove('clickedButton')
        document.querySelector('#addTable').classList.remove('clickedButton')

         //the tables can't move now
         document.querySelectorAll('.table').forEach(element => {
            element.classList.remove('movingTable')
        })
    }
})


//Problemes en cours :

/*

Dans le deplacement de tables uniquement la derniere table cree peut etre bougée
Quand je deplace une table sur une autre table le deplacement doit etre annule et retourner a sa position de base
Faire apparaitre la nouvelle table au milieu de l'ecran et non en haut a gauche (donner une classe aux nouvelles tables qui vient d'apparaitre pour
qu'elles soient toujours au milieu "newTable")


*/ 