import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { TileStyle } from '../../data/types';
import { buildCompleteStyle } from '../../utils/styleHelpers';

interface SandboxProps {
  palette: TileStyle[];
  grid: (number | null)[][];
  paintCell: (row: number, col: number) => void;
  clearGrid: () => void;
  randomizeGrid: () => void;
  setGrid: (grid: (number | null)[][]) => void;
}

const MIN_GRID_SIZE = 16;
const MAX_GRID_SIZE = 64;
const ZOOM_LEVELS = [12, 18, 24]; // Cell sizes in pixels

const Sandbox: React.FC<SandboxProps> = ({
  palette,
  grid,
  paintCell,
  clearGrid,
  randomizeGrid,
  setGrid,
}) => {
  const [isPainting, setIsPainting] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1); // Index for ZOOM_LEVELS
  const [gridDimensions, setGridDimensions] = useState({ rows: grid.length || 16, cols: grid[0]?.length || 16 });
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateGridSize = () => {
      if (gridContainerRef.current) {
        const { width, height } = gridContainerRef.current.getBoundingClientRect();
        const cellSize = ZOOM_LEVELS[zoomLevel] + (showGridLines ? 1 : 0);
        
        const newCols = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Math.floor(width / cellSize)));
        const newRows = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, Math.floor(height / cellSize)));

        if (newRows !== gridDimensions.rows || newCols !== gridDimensions.cols) {
          setGridDimensions({ rows: newRows, cols: newCols });

          const newGrid = Array.from({ length: newRows }, (_, r) =>
            Array.from({ length: newCols }, (_, c) => {
              return r < grid.length && c < (grid[0]?.length || 0) && grid[r] ? grid[r][c] : null;
            })
          );
          setGrid(newGrid);
        }
      }
    };

    updateGridSize();

    const resizeObserver = new ResizeObserver(updateGridSize);
    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [zoomLevel, showGridLines, setGrid, grid.length, grid[0]?.length]);
    
  useEffect(() => {
  }, [grid, palette]);

  const handleMouseDown = (rowIndex: number, cellIndex: number) => {
    setIsPainting(true);
    paintCell(rowIndex, cellIndex);
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isPainting) {
      paintCell(rowIndex, cellIndex);
    }
  };

  const getCellStyle = (rowIndex: number, cellIndex: number): React.CSSProperties => {
    const paletteIndex = grid[rowIndex]?.[cellIndex];
    const baseStyle: React.CSSProperties = {
        width: `${ZOOM_LEVELS[zoomLevel]}px`,
        height: `${ZOOM_LEVELS[zoomLevel]}px`,
        boxSizing: 'border-box',
    };

    if (paletteIndex === null || paletteIndex === undefined || !palette[paletteIndex]) {
      return { ...baseStyle, backgroundColor: '#ddd' };
    }
    
    const rawTileStyle = palette[paletteIndex];
    const completeTileStyle = buildCompleteStyle(rawTileStyle);

    if (rawTileStyle.blend) {
        const { rows, cols } = gridDimensions;
        const isSameTile = (r: number, c: number) => grid[r]?.[c] === paletteIndex;

        const hasTop = rowIndex > 0 && isSameTile(rowIndex - 1, cellIndex);
        const hasBottom = rowIndex < rows - 1 && isSameTile(rowIndex + 1, cellIndex);
        const hasLeft = cellIndex > 0 && isSameTile(rowIndex, cellIndex - 1);
        const hasRight = cellIndex < cols - 1 && isSameTile(rowIndex, cellIndex + 1);

        if (hasTop) completeTileStyle.borderTop = 'none';
        if (hasBottom) completeTileStyle.borderBottom = 'none';
        if (hasLeft) completeTileStyle.borderLeft = 'none';
        if (hasRight) completeTileStyle.borderRight = 'none';
        
        if (hasTop || hasLeft) completeTileStyle.borderTopLeftRadius = 0;
        if (hasTop || hasRight) completeTileStyle.borderTopRightRadius = 0;
        if (hasBottom || hasLeft) completeTileStyle.borderBottomLeftRadius = 0;
        if (hasBottom || hasRight) completeTileStyle.borderBottomRightRadius = 0;
    }

    return { ...baseStyle, ...completeTileStyle };
  };

  const generateGridCells = () => {
    const cells = [];
    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            className="grid-cell"
            onMouseDown={() => handleMouseDown(row, col)}
            onMouseEnter={() => handleMouseEnter(row, col)}
            style={getCellStyle(row, col)}
          />
        );
      }
    }
    return cells;
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridDimensions.cols}, ${ZOOM_LEVELS[zoomLevel]}px)`,
    gridTemplateRows: `repeat(${gridDimensions.rows}, ${ZOOM_LEVELS[zoomLevel]}px)`,
    gap: showGridLines ? '1px' : '0',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: showGridLines ? '#555' : 'transparent',
    border: showGridLines ? '1px solid #555' : 'none',
    overflow: 'hidden',
  };

  return (
    <div className="sandbox" onMouseUp={() => setIsPainting(false)} onMouseLeave={() => setIsPainting(false)}>
        <div className="sandbox-controls">
            <button onClick={clearGrid}>Clear</button>
            <button onClick={randomizeGrid}>Randomize</button>
            <button onClick={() => setShowGridLines(!showGridLines)} className={showGridLines ? 'active' : ''}>
                Grid
            </button>
            <div className="zoom-controls">
                <button onClick={() => setZoomLevel(0)} className={zoomLevel === 0 ? 'active' : ''}>1x</button>
                <button onClick={() => setZoomLevel(1)} className={zoomLevel === 1 ? 'active' : ''}>2x</button>
                <button onClick={() => setZoomLevel(2)} className={zoomLevel === 2 ? 'active' : ''}>3x</button>
            </div>
            <span>{`${gridDimensions.rows} × ${gridDimensions.cols}`}</span>
        </div>
      <div 
        ref={gridContainerRef} 
        className={`sandbox-grid ${!showGridLines ? 'no-grid' : ''}`}
        style={gridStyle}
      >
        {generateGridCells()}
      </div>
    </div>
  );
};

export default Sandbox;
