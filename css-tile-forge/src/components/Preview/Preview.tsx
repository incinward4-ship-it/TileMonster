
import React, { useState } from 'react';
import { TileStyle } from '../../data/types';

interface PreviewProps {
  tileStyles: TileStyle;
  isBlendMode: boolean;
  onBlendChange: (isBlended: boolean) => void;
}

const Preview: React.FC<PreviewProps> = ({ tileStyles, isBlendMode, onBlendChange }) => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(3).fill(null).map(() => Array(3).fill(true))
  );

  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? !c : c))
    );
    setGrid(newGrid);
  };

  const getBlendedStyles = (row: number, col: number): React.CSSProperties => {
    if (!grid[row][col]) {
      return {
        border: '1px dashed #ccc',
        backgroundColor: 'transparent',
      };
    }

    const style: React.CSSProperties = { ...tileStyles };

    if (isBlendMode) {
      const top = row > 0 && grid[row - 1][col];
      const bottom = row < 2 && grid[row + 1][col];
      const left = col > 0 && grid[row][col - 1];
      const right = col < 2 && grid[row][col + 1];

      if (top) style.borderTopWidth = 0;
      if (bottom) style.borderBottomWidth = 0;
      if (left) style.borderLeftWidth = 0;
      if (right) style.borderRightWidth = 0;

      if (top || left) style.borderTopLeftRadius = 0;
      if (top || right) style.borderTopRightRadius = 0;
      if (bottom || left) style.borderBottomLeftRadius = 0;
      if (bottom || right) style.borderBottomRightRadius = 0;
    }

    return style;
  };

  return (
    <div>
        <div className="preview-container">
            <h3>1x1 Tile</h3>
            <div
                className="preview-tile single-tile"
                style={{
                  ...tileStyles,
                  width: 25,
                  height: 25,
                  boxSizing: 'border-box',
                }} />
        </div>
      <div className="preview-container">
        <h3>3x3 Grid Preview</h3>
        <div
          className="preview-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 25px)',
            gridTemplateRows: 'repeat(3, 25px)',
            gap: 0,
            border: 'none',
            width: 'fit-content',
          }}
        >
          {grid.map((rowArr, r) =>
            rowArr.map((_, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => toggleCell(r, c)}
                style={{
                  width: 25,
                  height: 25,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  ...getBlendedStyles(r, c),
                }}
                title={`Cell [${r + 1}, ${c + 1}] - Click to toggle`}
              />
            ))
          )}
        </div>
      </div>
      <div className="preview-controls" style={{ marginTop: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isBlendMode}
            onChange={(e) => onBlendChange(e.target.checked)}
          />
          Blend tiles
        </label>
      </div>
    </div>
  );
};

export default Preview;
