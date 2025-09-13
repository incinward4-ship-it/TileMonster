
import React, { useState, useEffect } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import Preview from './components/Preview/Preview';
import { TileStyle, ActiveAttribute } from './data/types';
import { CSS_ATTRIBUTES } from './data/css-attributes';
import './App.css';


// Each cell in 32x32 grid stores either null or index into palette
type GridCell = number | null;


// Create empty 32x32 grid with null cells
const createEmptyGrid = (): GridCell[][] =>
  Array.from({ length: 32 }, () => Array(32).fill(null));

const defaultTileStyle: TileStyle = {
    backgroundColor: '#d3d3d3', // light gray
    border: '2px solid darkgrey',
    borderRadius: '8px',
  };

function App() {
  // Palette of saved tile styles
  const [palette, setPalette] = useState<TileStyle[]>([]);

  // 32x32 sandbox grid storing indexes into palette or null
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid());

  // Index of selected palette style for painting
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);

  const [activeAttributes, setActiveAttributes] = useState<ActiveAttribute[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle>(defaultTileStyle);
  const [isBlendMode, setIsBlendMode] = useState<boolean>(false);

  useEffect(() => {
    const newStyles: React.CSSProperties = {};
    const gradients: string[] = [];
    const filters: string[] = [];
    const transforms: string[] = [];

    if (activeAttributes.length === 0) {
        setTileStyles(defaultTileStyle);
        return;
    }

    activeAttributes.forEach(({ definition, value }) => {
      switch (definition.id) {
        case 'backgroundColor':
          newStyles.backgroundColor = value;
          break;
        case 'backgroundPosition': newStyles.backgroundPosition = value; break;
        case 'backgroundSize': newStyles.backgroundSize = value; break;
        case 'backgroundRepeat': newStyles.backgroundRepeat = value; break;
        case 'borderRadius': newStyles.borderRadius = `${value}px`; break;
        case 'clipPath': newStyles.clipPath = value; break;

        case 'border':
          newStyles.border = `${value.width}px ${value.style} ${value.color}`;
          break;
        case 'boxShadow':
          const shadow = `${value.inset ? 'inset ' : ''}${value.offsetX}px ${value.offsetY}px ${value.blurRadius}px ${value.spreadRadius}px ${value.color}`;
          newStyles.boxShadow = newStyles.boxShadow ? `${newStyles.boxShadow}, ${shadow}` : shadow;
          break;

        case 'linear-gradient':
          gradients.push(`linear-gradient(${value.angle}deg, ${value.color1}, ${value.color2})`);
          break;
        case 'radial-gradient':
          gradients.push(`radial-gradient(circle, ${value.color1}, ${value.color2})`);
          break;
        case 'filter':
          Object.keys(value).forEach(key => {
            const subDef = CSS_ATTRIBUTES.find(d => d.id === 'filter')?.subAttributes?.find(d => d.id === key);
            if (subDef && value[key] !== subDef.defaultValue) {
              const unit = key === 'hueRotate' ? 'deg' : key === 'blur' ? 'px' : '';
              filters.push(`${key}(${value[key]}${unit})`);
            }
          });
          break;
        case 'transform':
            Object.keys(value).forEach(key => {
                const subDef = CSS_ATTRIBUTES.find(d => d.id === 'transform')?.subAttributes?.find(d => d.id === key);
                if (subDef && value[key] !== subDef.defaultValue) {
                    const unit = key.includes('translate') ? 'px' : key.includes('rotate') ? 'deg' : '';
                    const transformKey = key.includes('scale') ? key : key.split(/(?=[A-Z])/).join('-').toLowerCase();
                    transforms.push(`${transformKey}(${value[key]}${unit})`);
                }
            });
            break;
      }
    });

    if (gradients.length > 0) newStyles.backgroundImage = gradients.join(', ');
    if (filters.length > 0) newStyles.filter = filters.join(' ');
    if (transforms.length > 0) newStyles.transform = transforms.join(' ');

    setTileStyles(newStyles);
  }, [activeAttributes]);


  // Add current style to palette and auto-select it
  const saveStyleToPalette = (style: TileStyle) => {
    const finalStyle: TileStyle = {
        ...tileStyles,
        blend: isBlendMode,
        transform: tileStyles.transform, // Already in tileStyles
      };
    setPalette(prev => {
      const newPalette = [...prev, finalStyle];
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
              activeAttributes={activeAttributes}
              setActiveAttributes={setActiveAttributes}
            />
            <Preview tileStyles={tileStyles} isBlendMode={isBlendMode} onBlendChange={setIsBlendMode} />
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
