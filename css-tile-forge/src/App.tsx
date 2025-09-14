import React, { useState, useEffect } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import Preview from './components/Preview/Preview';
import { TileStyle, ActiveAttribute } from './data/types';
import { buildCompleteStyle } from './utils/styleHelpers';
import './App.css';
import { CSS_ATTRIBUTES } from './data/css-attributes';

type GridCell = number | null;
const createEmptyGrid = (rows: number, cols: number): GridCell[][] => Array.from({ length: rows }, () => Array(cols).fill(null));

const ayellowLegacyStyle: TileStyle = {
  backgroundColor: '#FFD700', // Gold
  border: '2px solid #DAA520', // GoldenRod
  borderRadius: '4px',
  boxShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
};

const defaultTileStyle: TileStyle = {
  backgroundColor: '#d3d3d3',
  border: '2px solid darkgrey',
  borderRadius: '8px',
};

const evolveStyle = (style1: TileStyle, style2: TileStyle): TileStyle => {
  const childStyle: TileStyle = {};
  const allKeys = Array.from(new Set([...Object.keys(style1), ...Object.keys(style2)])) as (keyof TileStyle)[];

  allKeys.forEach(key => {
    if (key === 'blend') return;
    const fromParent1 = style1[key] !== undefined;
    const fromParent2 = style2[key] !== undefined;

    if (fromParent1 && fromParent2) {
      childStyle[key] = Math.random() < 0.5 ? style1[key] : style2[key];
    } else if (fromParent1) {
      childStyle[key] = style1[key];
    } else if (fromParent2) {
      childStyle[key] = style2[key];
    }
  });
  return childStyle;
};

function App() {
  const [palette, setPalette] = useState<TileStyle[]>([ayellowLegacyStyle]);
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid(16, 16));
  const [selectedStyleIndices, setSelectedStyleIndices] = useState<number[]>([]);
  const [activeAttributes, setActiveAttributes] = useState<ActiveAttribute[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle>(defaultTileStyle);
  const [isBlendMode, setIsBlendMode] = useState(false);

  useEffect(() => {
    if (selectedStyleIndices.length !== 1) {
      const newActiveAttributes: ActiveAttribute[] = [];
      for (const key in defaultTileStyle) {
        if (key !== 'blend') {
          const definition = CSS_ATTRIBUTES.find(def => def.id === key);
          if (definition) {
            newActiveAttributes.push({ id: key, definition, value: defaultTileStyle[key as keyof TileStyle] });
          }
        }
      }
      setActiveAttributes(newActiveAttributes);
    } else {
      const selectedStyle = palette[selectedStyleIndices[0]];
      const newActiveAttributes: ActiveAttribute[] = [];
      for (const key in selectedStyle) {
        if (key !== 'blend') {
          const definition = CSS_ATTRIBUTES.find(def => def.id === key);
          if (definition) {
            newActiveAttributes.push({ id: key, definition, value: selectedStyle[key as keyof TileStyle] });
          }
        }
      }
      setActiveAttributes(newActiveAttributes);
    }
  }, [selectedStyleIndices, palette]);

  useEffect(() => {
    const rawStyle = getRawStyleFromAttributes(activeAttributes);
    const completeStyle = buildCompleteStyle(rawStyle);
    setTileStyles(completeStyle);
  }, [activeAttributes]);

  const getRawStyleFromAttributes = (attributes: ActiveAttribute[]) => {
    const rawStyle: TileStyle = {};
    attributes.forEach(attr => {
        rawStyle[attr.definition.id as keyof TileStyle] = attr.value;
    });
    return rawStyle;
  };

  const saveStyleToPalette = () => {
    const rawStyle = getRawStyleFromAttributes(activeAttributes);
    const finalStyle: TileStyle = { ...rawStyle, blend: isBlendMode };
    
    setPalette(prev => {
      const newPalette = [...prev, finalStyle];
      setSelectedStyleIndices([newPalette.length - 1]);
      return newPalette;
    });
  };

  const handleUpdate = () => {
    if (selectedStyleIndices.length !== 1) return;
    const rawStyle = getRawStyleFromAttributes(activeAttributes);
    const updatedStyle = { ...rawStyle, blend: isBlendMode };
    setPalette(prev => {
      const newPalette = [...prev];
      newPalette[selectedStyleIndices[0]] = updatedStyle;
      return newPalette;
    });
  };

  const handleEvolve = () => {
    if (selectedStyleIndices.length !== 2) return;
    const parent1 = palette[selectedStyleIndices[0]];
    const parent2 = palette[selectedStyleIndices[1]];
    const childStyle = evolveStyle(parent1, parent2);
    setPalette(prev => {
      const newPalette = [...prev, childStyle];
      setSelectedStyleIndices([newPalette.length - 1]);
      return newPalette;
    });
  };

  const handleDelete = () => {
    if (selectedStyleIndices.length === 0) return;

    const sortedIndices = [...selectedStyleIndices].sort((a, b) => b - a);
    let newPalette = [...palette];
    sortedIndices.forEach(index => newPalette.splice(index, 1));

    const indexMap = new Map<number, number | null>();
    let newIndex = 0;
    palette.forEach((_, oldIndex) => {
      if (selectedStyleIndices.includes(oldIndex)) {
        indexMap.set(oldIndex, null);
      } else {
        indexMap.set(oldIndex, newIndex++);
      }
    });

    const newGrid = grid.map(row =>
      row.map(cell => {
        if (cell === null) return null;
        return indexMap.get(cell) ?? null;
      })
    );

    setPalette(newPalette);
    setGrid(newGrid);
    setSelectedStyleIndices([]);
  };

  const paintCell = (row: number, col: number) => {
    if (selectedStyleIndices.length === 0) return;
    const styleIndexToPaint = selectedStyleIndices[selectedStyleIndices.length - 1];
    const newGrid = grid.map(r => [...r]);
    if (newGrid[row] && newGrid[row][col] !== undefined) {
      newGrid[row][col] = styleIndexToPaint;
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
    const newGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.floor(Math.random() * palette.length)));
    setGrid(newGrid);
  };

  return (
    <div className="App">
      <header className="App-header-sticky">
        <div className="large-logo-tile blinking-eye" style={tileStyles}></div>
        <h1 className="app-title">Tile Monster</h1>
        <StylePalette
          palette={palette}
          selectedStyleIndices={selectedStyleIndices}
          setSelectedStyleIndices={setSelectedStyleIndices}
          onUpdate={handleUpdate} 
          onEvolve={handleEvolve}
          onDelete={handleDelete}
          livePreviewStyle={tileStyles} // Pass the live style here
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
