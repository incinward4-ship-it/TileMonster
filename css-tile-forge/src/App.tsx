import React, { useState, useEffect } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import Preview from './components/Preview/Preview';
import { TileStyle, ActiveAttribute } from './data/types';
import { buildTransformString, buildFilterString, buildGradientString } from './utils/styleHelpers';
import './App.css';

type GridCell = number | null;
const createEmptyGrid = (rows: number, cols: number): GridCell[][] => Array.from({ length: rows }, () => Array(cols).fill(null));

const defaultTileStyle: TileStyle = {
  backgroundColor: '#d3d3d3',
  border: '2px solid darkgrey',
  borderRadius: '8px',
};

function App() {
  const [palette, setPalette] = useState<TileStyle[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid(16, 16));
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
  const [activeAttributes, setActiveAttributes] = useState<ActiveAttribute[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle>(defaultTileStyle);
  const [isBlendMode, setIsBlendMode] = useState(false);

  useEffect(() => {
    // Build styles from active attributes
    const newStyles: React.CSSProperties = {};
    
    activeAttributes.forEach(attr => {
      const { definition, value } = attr;
      
      switch (definition.id) {
        case 'backgroundColor':
          newStyles.backgroundColor = value;
          break;
          
        case 'backgroundImage':
          if (value && value.colors && value.colors.length >= 2) {
            newStyles.backgroundImage = buildGradientString(value);
          }
          break;
          
        case 'border':
          if (value) {
            newStyles.border = `${value.width}px ${value.style} ${value.color}`;
          }
          break;
          
        case 'borderTop':
          if (value) {
            newStyles.borderTop = `${value.width}px ${value.style} ${value.color}`;
          }
          break;
          
        case 'borderRight':
          if (value) {
            newStyles.borderRight = `${value.width}px ${value.style} ${value.color}`;
          }
          break;
          
        case 'borderBottom':
          if (value) {
            newStyles.borderBottom = `${value.width}px ${value.style} ${value.color}`;
          }
          break;
          
        case 'borderLeft':
          if (value) {
            newStyles.borderLeft = `${value.width}px ${value.style} ${value.color}`;
          }
          break;
          
        case 'borderRadius':
          newStyles.borderRadius = `${value}px`;
          break;
          
        case 'opacity':
          newStyles.opacity = value;
          break;
          
        case 'boxShadow':
          if (value) {
            newStyles.boxShadow = `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`;
          }
          break;
          
        case 'transform':
          if (value) {
            newStyles.transform = buildTransformString(value);
          }
          break;
          
        case 'filter':
          if (value) {
            newStyles.filter = buildFilterString(value);
          }
          break;
          
        default:
          // For any other properties, just assign directly
          newStyles[definition.id as keyof React.CSSProperties] = value;
          break;
      }
    });
    
    setTileStyles(newStyles);
  }, [activeAttributes]);

  const saveStyleToPalette = () => {
    const finalStyle: TileStyle = {
      ...tileStyles,
      blend: isBlendMode,
      transform: tileStyles.transform,
    };
    setPalette(prev => {
      const newPalette = [...prev, finalStyle];
      setSelectedStyleIndex(newPalette.length - 1);
      return newPalette;
    });
  };

  const paintCell = (row: number, col: number) => {
    if (selectedStyleIndex === null) return;
    const newGrid = grid.map(r => [...r]);
    if (newGrid[row] && newGrid[row][col] !== undefined) {
        newGrid[row][col] = selectedStyleIndex;
        setGrid(newGrid);
    }
  };

  const clearGrid = () => {
    const { length: rows, 0: { length: cols } } = grid;
    setGrid(createEmptyGrid(rows, cols));
  };

  const randomizeGrid = () => {
    if (palette.length === 0) return;
    const { length: rows, 0: { length: cols } } = grid;
    const newGrid = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => 
            Math.random() > 0.7 ? null : Math.floor(Math.random() * palette.length)
        )
    );
    setGrid(newGrid);
  };

  return (
    <div className="App">
      <header className="App-header-sticky">
        <div className="large-logo-tile" style={tileStyles}></div>
        <h1>CSS-Tile-Forge</h1>
        <StylePalette
          palette={palette}
          selectedStyleIndex={selectedStyleIndex}
          setSelectedStyleIndex={setSelectedStyleIndex}
        />
      </header>

      <main className="App-main">
        <div className="left-column">
          <TextureCreator
            saveToPalette={saveStyleToPalette}
            activeAttributes={activeAttributes}
            setActiveAttributes={setActiveAttributes}
            tileStyles={tileStyles}
          />
          <Preview
            tileStyles={tileStyles}
            isBlendMode={isBlendMode}
            onBlendChange={setIsBlendMode}
          />
        </div>

        <div className="center-column">
          <Sandbox
            palette={palette}
            grid={grid}
            paintCell={paintCell}
            clearGrid={clearGrid}
            randomizeGrid={randomizeGrid}
            setGrid={setGrid}
          />
        </div>

        <div className="right-column">
          <Export palette={palette} grid={grid} />
        </div>
      </main>
    </div>
  );
}

export default App;
