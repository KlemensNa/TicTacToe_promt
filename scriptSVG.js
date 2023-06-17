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
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" 
            width="80px" 
            height="80px" 
            viewBox="0 0 100 100">
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