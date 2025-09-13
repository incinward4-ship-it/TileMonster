import React from 'react';
import { TileStyle } from '../../data/types';

interface ExportProps {
  palette: TileStyle[];
  grid: (number | null)[][];
}

const Export: React.FC<ExportProps> = ({ palette, grid }) => {
  const generateCSS = () => {
    let css = '/* Generated Tile Styles */\n\n';
    
    // Generate CSS for each tile style
    palette.forEach((style, index) => {
      css += `.tile-${index} {\n`;
      Object.entries(style).forEach(([property, value]) => {
        if (property !== 'blend' && value !== undefined) {
          // Convert camelCase to kebab-case
          const cssProperty = property.replace(/([A-Z])/g, '-\$$1').toLowerCase();
          css += `  ${cssProperty}: ${value};\n`;
        }
      });
      css += '}\n\n';
    });

    // Generate HTML structure
    css += '/* HTML Structure */\n';
    css += '/*\n';
    css += '<div class="tile-grid">\n';
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== null) {
          css += `  <div class="tile tile-${cell}" data-row="${rowIndex}" data-col="${colIndex}"></div>\n`;
        }
      });
    });
    css += '</div>\n';
    css += '*/\n\n';

    // Grid layout CSS
    css += '.tile-grid {\n';
    css += `  display: grid;\n`;
    css += `  grid-template-columns: repeat(${grid[0]?.length || 0}, 1fr);\n`;
    css += `  grid-template-rows: repeat(${grid.length}, 1fr);\n`;
    css += `  gap: 0;\n`;
    css += '}\n\n';

    css += '.tile {\n';
    css += '  box-sizing: border-box;\n';
    css += '}';

    return css;
  };

  const generateJSON = () => {
    return JSON.stringify({
      palette,
      grid,
      gridDimensions: {
        rows: grid.length,
        cols: grid[0]?.length || 0
      }
    }, null, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div className="export-section">
      <h3>Export</h3>
      
      <div>
        <h4>CSS</h4>
        <button onClick={() => copyToClipboard(generateCSS())}>
          Copy CSS
        </button>
        <pre>{generateCSS()}</pre>
      </div>

      <div>
        <h4>JSON Data</h4>
        <button onClick={() => copyToClipboard(generateJSON())}>
          Copy JSON
        </button>
        <pre>{generateJSON()}</pre>
      </div>
    </div>
  );
};

export default Export;
