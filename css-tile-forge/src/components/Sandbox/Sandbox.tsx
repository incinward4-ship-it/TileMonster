
import React, { useState } from 'react';
import { TileStyle } from '../../data/types';

interface SandboxProps {
  palette: TileStyle[];
  grid: (number | null)[][];
  paintCell: (row: number, col: number) => void;
  clearGrid: () => void;
  randomizeGrid: () => void;
}

const Sandbox: React.FC<SandboxProps> = ({
  palette,
  grid,
  paintCell,
  clearGrid,
  randomizeGrid,
}) => {
  const [isPainting, setIsPainting] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const handleMouseDown = (rowIndex: number, cellIndex: number) => {
    setIsPainting(true);
    paintCell(rowIndex, cellIndex);
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isPainting) {
      paintCell(rowIndex, cellIndex);
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const handleMouseLeave = () => {
    setIsPainting(false);
  };

  const toggleGridLines = () => {
    setShowGrid(!showGrid);
  };

  const getCellStyle = (rowIndex: number, cellIndex: number): React.CSSProperties => {
    const paletteIndex = grid[rowIndex][cellIndex];

    if (paletteIndex === null) {
      return {}; // Return empty style for empty cells
    }

    const tileStyle = palette[paletteIndex];
    if (!tileStyle) return {};

    const finalStyle: TileStyle = { ...tileStyle };

    if (tileStyle.blend) {
      // Check for neighbors that are also in blend mode
      const top = rowIndex > 0 && grid[rowIndex - 1][cellIndex] !== null && palette[grid[rowIndex - 1][cellIndex]!]?.blend;
      const bottom = rowIndex < grid.length - 1 && grid[rowIndex + 1][cellIndex] !== null && palette[grid[rowIndex + 1][cellIndex]!]?.blend;
      const left = cellIndex > 0 && grid[rowIndex][cellIndex - 1] !== null && palette[grid[rowIndex][cellIndex - 1]!]?.blend;
      const right = cellIndex < grid[0].length - 1 && grid[rowIndex][cellIndex + 1] !== null && palette[grid[rowIndex][cellIndex + 1]!]?.blend;

      // Remove borders on adjacent sides
      if (top) finalStyle.borderTopWidth = 0;
      if (bottom) finalStyle.borderBottomWidth = 0;
      if (left) finalStyle.borderLeftWidth = 0;
      if (right) finalStyle.borderRightWidth = 0;

      // Refine border radius at corners
      if (top || left) finalStyle.borderTopLeftRadius = 0;
      if (top || right) finalStyle.borderTopRightRadius = 0;
      if (bottom || left) finalStyle.borderBottomLeftRadius = 0;
      if (bottom || right) finalStyle.borderBottomRightRadius = 0;
    }

    finalStyle.transform = tileStyle.transform || 'none';

    return finalStyle;
  };

  return (
    <div className="sandbox" onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      <div className="sandbox-controls">
        <button onClick={clearGrid}>Clear</button>
        <button onClick={randomizeGrid}>Randomize</button>
        <button onClick={toggleGridLines}>{showGrid ? 'Hide Grid' : 'Show Grid'}</button>
      </div>
      <div className={`sandbox-grid ${!showGrid ? 'no-grid' : ''}`}>
        {grid.map((row, rowIndex) =>
          row.map((_, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className="grid-cell"
              onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
              style={getCellStyle(rowIndex, cellIndex)}
              aria-label={`Grid cell ${rowIndex + 1}, ${cellIndex + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sandbox;
