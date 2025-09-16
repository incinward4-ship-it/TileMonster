import React, { useState } from 'react';
import { TileStyle } from '../../data/types';
import styles from './Preview.module.css';
import { applyBlendStyles } from '../../utils/blendHelpers';

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

    const gridDimensions = { rows: grid.length, cols: grid[0].length };

    return applyBlendStyles(
        style,
        grid,
        row,
        col,
        gridDimensions,
        null,
        isBlendMode,
        tileStyles
    );
  };

  return (
    <div>
      <div className="preview-container">
        <h3>1x1 Tile</h3>
        <div
          className={`preview-tile ${styles.singleTile}`}
          style={{
            ...tileStyles,
          }}
        />
      </div>
      <div className="preview-container">
        <h3>3x3 Grid Preview</h3>
        <div
          className={`preview-grid ${styles.grid}`}
        >
          {grid.map((rowArr, r) =>
            rowArr.map((_, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => toggleCell(r, c)}
                className={styles.cell}
                style={{
                  ...getBlendedStyles(r, c),
                }}
                title={`Cell [${r + 1}, ${c + 1}] - Click to toggle`}
              />
            ))
          )}
        </div>
      </div>
      <div className={`preview-controls ${styles.previewControls}`}>
        <label>
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
