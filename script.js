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

  let currentPlayer ='circle';


  function init(){
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
            cellHTML += '>' +  crossSvgCode;
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
      cell.innerHTML = (currentPlayer === 'circle') ? circleSvgCode : crossSvgCode;   //wenn cPcircle, dann wir dKreis gemalt/ else wird Kreuz gemalt
      currentPlayer = (currentPlayer === 'circle') ? 'cross' : 'circle';        //if cP = circle, dann cP wird zu cross/ else cp = circle
      displayCurrentPlayer();
      if(isGameOver()){
        const winCells = checkWinner();
        highlightWinningCells(winCells);
        showGameOverScreen(p);
      }
    }
  }


  function isGameOver(){
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
    const winColor = '#178025';
    const lineColor = 'white';
  
    for (const cellIndex of cells) {                        // Index der drei Elemente aus dem übergebenen Array "cells" wird ermittelt und die Elemente gepeichert 
      const cell = document.getElementById('cell-' + cellIndex);    
      cell.style.backgroundColor = winColor;                // fügt der Gewinnerzelle die Farbe hinzu
    }
  
    if (cells.length === 3) {                               //eigentlich sinnlos Anweisung, da immer nur drei Elemente an die Funktion übergeben wurden
      const cellA = document.getElementById('cell-' + cells[0]);  
      const cellC = document.getElementById('cell-' + cells[2]);
      drawLineBetweenCells(cellA, cellC, lineColor);        // ermittle die beiden ID's der äußeren Zellen und übergibt diese der nächsten Funktion 
    }
  }


  function drawLineBetweenCells(cellA, cellC, lineColor) {
    const table = document.getElementById('content').getElementsByTagName('table')[0]; // eigentlich nur eine table da, deshalb kann [0] gelöscht werden
    
    const tableRect = table.getBoundingClientRect();
    // gibt folgende Werte der Tabelle zurück (Werte relativ zum Anzeigenbereich des Browsers)
    // console.log(tableRect.x); // Horizontale Position des linken Rands
    // console.log(tableRect.y); // Vertikale Position des oberen Rands
    // console.log(tableRect.width); // Breite des Rechtecks
    // console.log(tableRect.height); // Höhe des Rechtecks
    // console.log(tableRect.right); // Horizontale Position des rechten Rands
    // console.log(tableRect.bottom); // Vertikale Position des unteren Rands
  
    const line = document.createElement('div');        //erstelle div für die Linie und gib ihm style=absolut und die Farbe
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


  function generateCircleSvgCode() {
    const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="80px" 
            height="80px" 
            viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00B0EF" stroke-width="5">
                <animate attributeName="r" from="0" to="45" dur="0.3s" repeatCount="0" />
            </circle>
        </svg>`;
  
    return svgCode;
  }
  
  function generateCrossSvgCode() {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 100 100">
      <line x1="10" y1="10" x2="90" y2="90" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" from="10" to="90" dur="0.3s" repeatCount="0" />
      </line>
      <line x1="90" y1="10" x2="10" y2="90" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" from="90" to="10" dur="0.3s" repeatCount="0" />
      </line>
    </svg>`;
  
    return svgCode;
  }

   const circleSvgCode = generateCircleSvgCode();
  const crossSvgCode = generateCrossSvgCode();

  

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


  function showGameOverScreen(winner) {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';

    sieger = (winner === 'circle') ? circleSvgCode : crossSvgCode;
  
    const winnerMessage = document.createElement('p');
    winnerMessage.innerHTML = `${sieger} &nbsp; hat gewonnen`;
  
    const playAgainButton = document.createElement('button');
    playAgainButton.id = 'playAgainBtn';
    playAgainButton.textContent = 'Play again';
    playAgainButton.addEventListener('click', resetGame);
  
    // gameOverScreen.appendChild(message);
    gameOverScreen.appendChild(winnerMessage);
    gameOverScreen.appendChild(playAgainButton);

    let player = document.getElementById('currentplayer');
    document.getElementById('player').replaceChild(gameOverScreen, player);
  }
  
  function resetGame() {
    fields = [
      null, null, null,
      null, null, null,
      null, null, null
    ];
  
    document.getElementById('winningLine').remove();
  
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.remove(); 
    
    init();
  }
  

  
  
  
  
  

  

  