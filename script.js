let fields = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

let currentPlayer = 'circle';
const line = document.createElement('div');


/** Funktionen  */

function init() {
  render();
  displayCurrentPlayer();
}


function render() {
  let tableHTML = '<table>';
  let index = 0;

  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';

    for (let j = 0; j < 3; j++) {
      let fieldValue = fields[index];
      let cellHTML = '<td id="cell-' + index + '"';         // generiert offenes td-Element, welches in jeder If-Anweisung beim generieren geschlossen wird

      if (fieldValue != null) {
        if (fieldValue === 'circle') {
          cellHTML += '>' + circleSvgCode;
        } else {
          cellHTML += '>' + crossSvgCode;
        }
      } else {
        cellHTML += ' onclick="handleCellClick(' + index + '); this.onclick = null;"></td>';     // this.onklick --> wenn geklickt, wird dieses Element auf null gesetzt
      }

      tableHTML += cellHTML;
      index++;
    }

    tableHTML += '</tr>';
  }

  tableHTML += '</table>';
  document.getElementById('content').innerHTML = tableHTML;
}


function handleCellClick(index) {
  if (isGameOver()) {
    return;
  }

  if (fields[index] === null) {
    let p = currentPlayer;                                          // Feld auf das geklickt wurde = null?
    fields[index] = currentPlayer;                                            // index des Array fields wird entweder auf circle oder cross gesetzt (dann nicht mehr leer)      
    let cell = document.getElementById('cell-' + index);
    drawSymbol(cell);
    currentPlayer = changeCurrentPlayer();        //if cP = circle, dann cP wird zu cross/ else cp = circle
    displayCurrentPlayer();
    if (isGameOver()) {
      const winCells = checkWinner();
      highlightWinningCells(winCells);
      showGameOverScreen(winCells, p);
    }
  }
}


function drawSymbol(cell) {
  cell.innerHTML = (currentPlayer === 'circle') ? circleSvgCode : crossSvgCode;   //wenn cPcircle, dann wir dKreis gemalt/ else wird Kreuz gemalt
}


function changeCurrentPlayer() {
  return (currentPlayer === 'circle') ? 'cross' : 'circle'
}


function isGameOver() {
  return fields.every((field) => field !== null) || checkWinner() != null;
  // wenn JEDE Möglichkeit in every() erfüllt ist, wird true zurückgegeben
}


function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontale Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikale Reihen
    [0, 4, 8], [2, 4, 6] // diagonale Reihen
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;                                                    //prüfe mit for-Scheleife jede combination, ob Bedingung unten (If) erfüllt ist
    if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c]) {  // Feld mit Index a ist nicht null und die beiden anderen Felder besitzen den selben Wert wie a
      const winningCells = [a, b, c];
      return winningCells;
      // return die Combi bzw. != null für die Abfrage in isGameOver()
    }
  }
  return null; // Kein Gewinner
}


function highlightWinningCells(cells) {
  if (cells == null) {              // Abbruch falls kein Sieger
    return
  }

  const winColor = '#178025';
  for (const cellIndex of cells) {                        // Index der drei Elemente aus dem übergebenen Array "cells" wird ermittelt und die Elemente gepeichert 
    const cell = document.getElementById('cell-' + cellIndex);
    cell.style.backgroundColor = winColor;                // fügt der Gewinnerzelle die Farbe hinzu
  }

  drawLineBetweenCells(cells);        // ermittle die beiden ID's der äußeren Zellen und übergibt diese der nächsten Funktion 
}


function drawLineBetweenCells(cells) {
  const lineColor = 'white';
  const cellA = document.getElementById('cell-' + cells[0]);
  const cellC = document.getElementById('cell-' + cells[2]);
  const table = document.getElementById('content').getElementsByTagName('table')[0]; // eigentlich nur eine table da, deshalb kann [0] gelöscht werden

  const tableRect = table.getBoundingClientRect();
  // gibt folgende Werte der Tabelle zurück (Werte relativ zum Anzeigenbereich des Browsers)
  // console.log(tableRect.x); // Horizontale Position des linken Rands
  // console.log(tableRect.y); // Vertikale Position des oberen Rands
  // console.log(tableRect.width); // Breite des Rechtecks
  // console.log(tableRect.height); // Höhe des Rechtecks
  // console.log(tableRect.right); // Horizontale Position des rechten Rands
  // console.log(tableRect.bottom); // Vertikale Position des unteren Rands

  line.id = 'winningLine';
  line.style.position = 'absolute';
  line.style.background = lineColor;

  const cellARect = cellA.getBoundingClientRect();    //gibt Daten zu Position der äußeren Gewinnerzellen zurück
  const cellCRect = cellC.getBoundingClientRect();

  const cellACenterX = cellARect.left - tableRect.left + cellARect.width / 2;       //Berechnet die Koordinaten der Mittelpunkte der Gewinnerzellen
  const cellACenterY = cellARect.top - tableRect.top + cellARect.height / 2;

  const cellCCenterX = cellCRect.left - tableRect.left + cellCRect.width / 2;
  const cellCCenterY = cellCRect.top - tableRect.top + cellCRect.height / 2;

  const lineLength = Math.sqrt(Math.pow(cellCCenterX - cellACenterX, 2) + Math.pow(cellCCenterY - cellACenterY, 2));    //Berechnung der Linienlänge
  const lineAngle = Math.atan2(cellCCenterY - cellACenterY, cellCCenterX - cellACenterX);                               //Winkelberechnung

  line.style.width = lineLength + 'px';           // vergibt Länge (hier Breite) und Höhe (feste 5px) der Linie fest
  line.style.height = '5px';
  line.style.transformOrigin = 'top left';        // Drehung der Linie am oberen Linken Punkt --> sonst wird in der Mitte der Linie gedreht und die Linie verläuuft falsch
  line.style.transform = 'translate(' + cellACenterX + 'px, ' + cellACenterY + 'px) rotate(' + lineAngle + 'rad)';

  line.style.left = tableRect.left + 'px';
  line.style.top = tableRect.top + 'px';

  document.body.appendChild(line);                //Linie als neues Element dem Body hinzugefügt  
}


function displayCurrentPlayer() {
  const currentPlayerDiv = document.getElementById('currentplayer'); // Überprüfe, ob das Element bereits existiert

  // Wenn das Element bereits existiert, entferne es, um es zu aktualisieren
  if (currentPlayerDiv) {
    currentPlayerDiv.remove();
  }

  // Erstelle ein neues <div>-Element
  const newCurrentPlayerDiv = document.createElement('div');
  newCurrentPlayerDiv.id = 'currentplayer';

  // Erstelle ein neues <p>-Element für den Text "Am Zug"
  const currentPlayerText = document.createElement('h2');
  currentPlayerText.textContent = 'Als nächstes am Zug';

  // Erstelle ein neues <div>-Element für das SVG des aktuellen Spielers
  const currentPlayerSvg = document.createElement('div');
  currentPlayerSvg.innerHTML = (currentPlayer === 'circle') ? circleSvgCode : crossSvgCode;

  // Füge den Text und das SVG zum neuen <div>-Element hinzu
  newCurrentPlayerDiv.appendChild(currentPlayerText);
  newCurrentPlayerDiv.appendChild(currentPlayerSvg);

  // Füge das neue <div>-Element vor dem ersten Kind des 'player'-Elements ein
  document.getElementById('player').insertBefore(newCurrentPlayerDiv, document.getElementById('player').firstChild);
}


function showGameOverScreen(winningCells, winner) {
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'game-over-screen';
  const winnerMessage = document.createElement('div');

  if (winningCells === null) {
      winnerMessage.innerHTML = "Unentschieden";
  } else {
    const playerSymbol = (winner === 'circle') ? circleSvgCode : crossSvgCode;
    winnerMessage.innerHTML = `<p>${playerSymbol} &nbsp; hat gewonnen</p>`;
  }

  createGameOverScreen(winnerMessage, gameOverScreen);
  renderGameOverScreen(gameOverScreen);
  
}


function generatePlayAgainBtn(){
  const playAgainButton = document.createElement('button');
  playAgainButton.id = 'playAgainBtn';
  playAgainButton.textContent = 'Play again';
  playAgainButton.addEventListener('click', resetGame);
  return playAgainButton;
}


function createGameOverScreen(winnerMessage, gameOverScreen){
  gameOverScreen.appendChild(winnerMessage);
  gameOverScreen.appendChild(generatePlayAgainBtn());
  return gameOverScreen;
}

//falls fehler, dann hier schauen
function renderGameOverScreen(gameOverScreen){
  let player = document.getElementById('currentplayer');
  document.getElementById('player').replaceChild(gameOverScreen, player);
}


function resetGame() {
  fields = [
    null, null, null,
    null, null, null,
    null, null, null
  ];

  line.remove();

  const gameOverScreen = document.getElementById('game-over-screen');
  gameOverScreen.remove();
  init();
}












