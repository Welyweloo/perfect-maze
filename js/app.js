// Retrieving get parameters to draw the maze.
let url_string = window.location.href;
let url = new URL(url_string);
let width = parseInt(url.searchParams.get("width"));
let height = parseInt(url.searchParams.get("height"));

/**
 * Checking if the user changed the url
 */
let regExp = /[a-zA-Z]/g;
if(regExp.test(url.searchParams.get("width")) || regExp.test(url.searchParams.get("height"))){
    window.location.replace("./index.html");
}

// Defining main div
let mainDiv = document.getElementById('main');

//Launching the game
playMaze();

/**
 * Algorithm to draw the maze according to the width and height given by the user
 * @param {Interger} width Width of the maze
 * @param {Interger} height Height of the maze
 */
function drawMaze(width, height) {
    
    mainDiv.innerHTML = '';
    let table = document.createElement('table');
    mainDiv.appendChild(table);

    let numberOfRows = height;

    while(numberOfRows > 0){

        trElement = document.createElement('tr');
        table.appendChild(trElement);

        let numberOfColumns = width;

        while (numberOfColumns > 0) {

            tdElement = document.createElement('td');
            trElement.appendChild(tdElement);   
            numberOfColumns--;
        }

        numberOfRows--;
    }

    return table;
}

//Source : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Defining configuration to play : start and end cells 
 * Adding event listener on keydown event.
 */
function playMaze() {

    table = drawMaze(width, height);

    //Pick a random start and end
    let configuration = defineMazeConfiguration();

    //Adding event listener on keyboard 
    window.addEventListener('keydown', function (evt) { moveLogo(evt, configuration['rows'], configuration['logo'], configuration['endCell']) }, false);
    
}

function defineMazeConfiguration() {

    let rows = table.querySelectorAll('tr');
    let numberOfRows = rows.length;
    let numberOfColumns = rows[0].querySelectorAll('td').length;

    // Defining the start and end cells
    randomNumber = getRandomInt(4);

    let startCell = '';
    let endCell = '';

    // Picks a random cell to start and end the maze.
    if(randomNumber == 0){

        startCell = rows[0].querySelectorAll('td')[getRandomInt(numberOfColumns-1)];
        endCell = rows[numberOfRows-1].querySelectorAll('td')[getRandomInt(numberOfColumns-1)];

    } else if(randomNumber == 1){

        startCell = rows[numberOfRows-1].querySelectorAll('td')[getRandomInt(numberOfColumns-1)];
        endCell = rows[0].querySelectorAll('td')[getRandomInt(numberOfColumns-1)];

    } else if(randomNumber == 2){

        startCell = rows[getRandomInt(numberOfRows-1)].querySelectorAll('td')[0];
        endCell = rows[getRandomInt(numberOfRows-1)].querySelectorAll('td')[numberOfColumns-1];

    } else if(randomNumber == 3){

        startCell = rows[getRandomInt(numberOfRows-1)].querySelectorAll('td')[numberOfColumns-1];
        endCell = rows[getRandomInt(numberOfRows-1)].querySelectorAll('td')[0];

    }

    startCell.style.backgroundColor = '#ff7a28';
    endCell.style.backgroundColor = '#ae28d3';

    //Cloning and displaying the logo
    let logo = document.querySelector('img');
    let ceresLogo = logo.cloneNode(true);
    startCell.appendChild(ceresLogo);
    ceresLogo.style.display = "block";

    return {
        'rows':rows, 
        'endCell':endCell,
        'logo': ceresLogo
    };
}

/**
 * Moving Ceres logo according to the pressed key.
 * @param {Object} evt The event object when keydown event is invoked
 * @param {Array} rows The array containing all rows
 * @param {Node} ceresLogo The node containing the ceres Logo
 * @param {Node} endCell The maze's exit
 */
function moveLogo(evt, rows, ceresLogo, endCell) {

    //Hiding rules
    document.getElementById('rules').style.display = "none";

    // Define style for the div displaying the wrong way error.
    let wrongWay = document.getElementById('wrong-way');
    wrongWay.style.display = "none";

    // Checking the current position
    let logoPosition = currentPosition(rows, ceresLogo);
    let rowPosition = logoPosition['row'];
    let columnPosition = logoPosition['column']; 

    /**
     * According to the pressed key, moves the Ceres logo to the appropriate cell
     * Otherwise show the error message.
     */
    if (evt.key === "ArrowRight" && rows[rowPosition].querySelectorAll('td')[columnPosition+1]){

        rows[rowPosition].querySelectorAll('td')[logoPosition['column']+1].appendChild(ceresLogo);
        logoPosition = currentPosition(rows, ceresLogo);
        
    } else if (evt.key === "ArrowLeft" && rows[rowPosition].querySelectorAll('td')[columnPosition-1]){

        rows[rowPosition].querySelectorAll('td')[columnPosition-1].appendChild(ceresLogo);
        logoPosition = currentPosition(rows, ceresLogo);

    } else if (evt.key === "ArrowUp" && rows[rowPosition-1]){

        rows[rowPosition-1].querySelectorAll('td')[columnPosition].appendChild(ceresLogo);
        logoPosition = currentPosition(rows, ceresLogo);

    } else if (evt.key === "ArrowDown" && rows[rowPosition+1]){

        rows[rowPosition+1].querySelectorAll('td')[columnPosition].appendChild(ceresLogo);
        logoPosition = currentPosition(rows, ceresLogo);

    } else {

        wrongWay.style.display = "block";
    }
   
    /**
     * If the end is reached shows successful robot and displays button to play again/
     */
    setTimeout( () =>  {
        if(endCell.querySelector('#logo')) {

            endCell.removeChild(ceresLogo);
    
            let robot = document.getElementById('robot');
            robot.style.display = "block";
            table.style.display = "none";

            let button = document.querySelector('button');
            button.style.display = "block";

            let successText = document.getElementById('successful');
            successText.style.display = "block";

            setTimeout( () =>  {
                button.addEventListener('click', function(evt){
                    window.location.replace("./index.html");
                })
            }, 500);
        }
    }, 500);

}

/**
 * Checking the current position
 * @param {Array} rows The array containing all rows
 * @param {Node} ceresLogo The node containing the ceres Logo
 * 
 */
function currentPosition(rows, ceresLogo){

    let currentPosition = {
        'row': 0,
        'column': 0
    }
    rows.forEach(

        function(row, indexRow){
            row.querySelectorAll('td').forEach(
                function(column, indexColumn){
                    if(column == ceresLogo.parentElement){
                        if(row == ceresLogo.parentElement.parentElement){
                            currentPosition['row'] = indexRow;
                            currentPosition['column'] = indexColumn;
                        }
                }
            }
            )
        }
    )

    return currentPosition;
}

