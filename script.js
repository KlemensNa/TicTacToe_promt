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
    if (fields[index] === null) {                                               // Feld auf das geklickt wurde = null?
      fields[index] = currentPlayer;                                            // index des Array fields wird entweder auf circle oder cross gesetzt (dann nicht mehr leer)
      currentPlayer = (currentPlayer === 'circle') ? 'cross' : 'circle';        //if cP = circle, dann cP wird zu cross/ else cp = circle
      let cell = document.getElementById('cell-' + index);                      
      cell.innerHTML = (currentPlayer === 'circle') ? circleSvgCode : crossSvgCode;   //wenn cPcircle, dann wir dKreis gemalt/ else wird Kreuz gemalt
      checkWinner();
    }
  }


  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontale Reihen
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikale Reihen
      [0, 4, 8], [2, 4, 6] // diagonale Reihen
    ];
  
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c]) {
        const winningCells = [a, b, c];
        highlightWinningCells(winningCells);
        return true; // Gewinner gefunden
      }
    }
  
    return false; // Kein Gewinner
  }

  function highlightWinningCells(cells) {
    const winColor = '#178025';
    const lineColor = 'white';
  
    for (const cellIndex of cells) {
      const cell = document.getElementById('cell-' + cellIndex);
      cell.style.backgroundColor = winColor;
    }
  
    if (cells.length === 3) {
      const cellA = document.getElementById('cell-' + cells[0]);
      const cellC = document.getElementById('cell-' + cells[2]);
      drawLineBetweenCells(cellA, cellC, lineColor);
    }
  }


  function drawLineBetweenCells(cellA, cellC, lineColor) {
    const table = document.getElementById('content').getElementsByTagName('table')[0];
    const tableRect = table.getBoundingClientRect();
  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.background = lineColor;
  
    const cellARect = cellA.getBoundingClientRect();
    const cellCRect = cellC.getBoundingClientRect();
  
    const cellACenterX = cellARect.left - tableRect.left + cellARect.width / 2;
    const cellACenterY = cellARect.top - tableRect.top + cellARect.height / 2;
  
    const cellCCenterX = cellCRect.left - tableRect.left + cellCRect.width / 2;
    const cellCCenterY = cellCRect.top - tableRect.top + cellCRect.height / 2;
  
    const lineLength = Math.sqrt(Math.pow(cellCCenterX - cellACenterX, 2) + Math.pow(cellCCenterY - cellACenterY, 2));
    const lineAngle = Math.atan2(cellCCenterY - cellACenterY, cellCCenterX - cellACenterX);
  
    line.style.width = lineLength + 'px';
    line.style.height = '5px';
    line.style.transformOrigin = 'top left';
    line.style.transform = 'translate(' + cellACenterX + 'px, ' + cellACenterY + 'px) rotate(' + lineAngle + 'rad)';
    
    line.style.left = tableRect.left + 'px';
    line.style.top = tableRect.top + 'px';
  
    document.body.appendChild(line);
  
  }
  
  
  
  
  
  
  
  
  


  function generateCircleSvgCode() {
    const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="100px" 
            height="100px" 
            viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00B0EF" stroke-width="5">
                <animate attributeName="r" from="0" to="45" dur="0.3s" repeatCount="0" />
            </circle>
        </svg>`;
  
    return svgCode;
  }
  
  function generateCrossSvgCode() {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100">
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
  
  
  
  

  

  