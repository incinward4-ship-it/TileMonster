
import React, { useState } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import { TileStyle } from './data/types';
import './App.css';


// Each cell in 32x32 grid stores either null or index into palette
type GridCell = number | null;


// Create empty 32x32 grid with null cells
const createEmptyGrid = (): GridCell[][] =>
  Array.from({ length: 32 }, () => Array(32).fill(null));

function App() {
  // Palette of saved tile styles
  const [palette, setPalette] = useState<TileStyle[]>([]);

  // 32x32 sandbox grid storing indexes into palette or null
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid());

  // Index of selected palette style for painting
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);

  // Add current style to palette and auto-select it
  const saveStyleToPalette = (style: TileStyle) => {
    setPalette(prev => {
      const newPalette = [...prev, style];
      setSelectedStyleIndex(newPalette.length - 1);
      return newPalette;
    });
  };

  // Paint grid cell with selected style index
  const paintCell = (row: number, col: number) => {
    if (selectedStyleIndex === null) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = selectedStyleIndex;
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid());
  };

  const randomizeGrid = () => {
    if (palette.length === 0) {
      alert("Please save at least one style to the palette before randomizing.");
      return;
    }
    const newGrid = grid.map(row => 
      row.map(() => {
        // Allow for some empty cells
        if (Math.random() > 0.7) {
            return null;
        }
        return Math.floor(Math.random() * palette.length)
      })
    );
    setGrid(newGrid);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>CSS-Tile-Forge</h1>
      </header>
      <main className="App-main">
        <div className="left-column">
            <TextureCreator
              saveToPalette={saveStyleToPalette}
            />
            <StylePalette
              palette={palette}
              selectedStyleIndex={selectedStyleIndex}
              setSelectedStyleIndex={setSelectedStyleIndex}
            />
        </div>
        <div className="center-column">
            <Sandbox
              palette={palette}
              grid={grid}
              paintCell={paintCell}
              clearGrid={clearGrid}
              randomizeGrid={randomizeGrid}
            />
        </div>
        <div className="right-column">
            <Export
              palette={palette}
              grid={grid}
            />
        </div>
      </main>
    </div>
  );
}

export default App;
