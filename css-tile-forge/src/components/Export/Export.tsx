
import React, { useState } from 'react';

interface ExportProps {
  palette: React.CSSProperties[];
  grid: (number | null)[][];
}

const Export: React.FC<ExportProps> = ({ palette, grid }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const cssKeyToKebab = (key: string) =>
    key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

  const formatCssProperties = (styles: React.CSSProperties): string =>
    Object.entries(styles)
      .map(([key, value]) => `  ${cssKeyToKebab(key)}: ${value};`)
      .join('\n');

  const generateCss = () => {
    const gridWidth = grid[0]?.length || 0;
    const gridHeight = grid.length;

    const paletteCss = palette
      .map((style, index) => `.tile-style-${index} {\n${formatCssProperties(style)}\n}`)
      .join('\n\n');

    const gridCss = `
.grid-container {
  display: grid;
  grid-template-columns: repeat(${gridWidth}, 20px);
  grid-template-rows: repeat(${gridHeight}, 20px);
  width: ${gridWidth * 20}px;
  height: ${gridHeight * 20}px;
}

.grid-cell {
  width: 20px;
  height: 20px;
}`;

    return `/* Palette Styles */\n${paletteCss}\n\n/* Grid Styles */\n${gridCss}`;
  };

  const generateHtml = () => {
    return `<div class="grid-container">\n${grid
      .flatMap((row, rowIndex) =>
        row.map((cell, cellIndex) => 
          `  <div class="grid-cell ${cell !== null ? `tile-style-${cell}` : ''}"></div>`
        )
      )
      .join('\n')}\n</div>`;
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-section">
      <h3>Export</h3>
      <h4>CSS</h4>
      <pre>{generateCss()}</pre>
      <button onClick={() => downloadFile(generateCss(), 'styles.css', 'text/css')}>Download CSS</button>
      <h4>HTML</h4>
      <pre>{generateHtml()}</pre>
      <button onClick={() => downloadFile(generateHtml(), 'index.html', 'text/html')}>Download HTML</button>
    </div>
  );
};

export default Export;
