import React, { useState, useEffect } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import { TileStyle, ActiveAttribute } from './data/types';
import { CSS_ATTRIBUTES } from './data/css-attributes';
import { buildTransformString } from './utils/styleHelpers';
import './App.css';

type GridCell = number | null;
const createEmptyGrid = (): GridCell[][] => Array.from({ length: 32 }, () => Array(32).fill(null));

const defaultTileStyle: TileStyle = {
  backgroundColor: '#d3d3d3',
  border: '2px solid darkgrey',
  borderRadius: '8px',
};

function App() {
  const [palette, setPalette] = useState<TileStyle[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid());
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
  const [activeAttributes, setActiveAttributes] = useState<ActiveAttribute[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle>(defaultTileStyle);
  const [isBlendMode, setIsBlendMode] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);

  useEffect(() => {
    const newStyles: React.CSSProperties = {};
    const gradients: string[] = [];
    const filters: string[] = [];
    let transformAttr: any = null;

    if (activeAttributes.length === 0) {
      setTileStyles(defaultTileStyle);
      return;
    }

    activeAttributes.forEach(({ definition, value }) => {
      switch (definition.id) {
        case 'backgroundColor':
          newStyles.backgroundColor = value;
          break;
        case 'backgroundGradient':
          gradients.push(`linear-gradient(${value.angle}deg, ${value.colors[0]}, ${value.colors[1]})`);
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
          transformAttr = value;
          break;
        case 'borderTop':
        case 'borderRight':
        case 'borderBottom':
        case 'borderLeft': {
          const side = definition.id.substring(6);
          const width = value[`border${side}Width`];
          const style = value[`border${side}Style`];
          const color = value[`border${side}Color`];
          const radius = value[`border${side}Radius`];

          if (width > 0) {
            newStyles[`border${side}Width`] = `${width}px`;
            newStyles[`border${side}Style`] = style;
            newStyles[`border${side}Color`] = color;
          } else {
            newStyles[`border${side}Width`] = '0px';
          }

          if (radius > 0) {
            if (side === 'Top') {
              newStyles.borderTopLeftRadius = `${radius}px`;
              newStyles.borderTopRightRadius = `${radius}px`;
            } else if (side === 'Right') {
              newStyles.borderTopRightRadius = `${radius}px`;
              newStyles.borderBottomRightRadius = `${radius}px`;
            } else if (side === 'Bottom') {
              newStyles.borderBottomLeftRadius = `${radius}px`;
              newStyles.borderBottomRightRadius = `${radius}px`;
            } else if (side === 'Left') {
              newStyles.borderTopLeftRadius = `${radius}px`;
              newStyles.borderBottomLeftRadius = `${radius}px`;
            }
          }
          break;
        }
        default:
          break;
      }
    });

    if (gradients.length > 0) newStyles.backgroundImage = gradients.join(', ');
    if (filters.length > 0) newStyles.filter = filters.join(' ');
    if (transformAttr) {
      newStyles.transform = buildTransformString(transformAttr);
    }

    setTileStyles(newStyles);
  }, [activeAttributes]);

  const saveStyleToPalette = (style: TileStyle) => {
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
    newGrid[row][col] = selectedStyleIndex;
    setGrid(newGrid);
  };

  const clearGrid = () => setGrid(createEmptyGrid());

  const randomizeGrid = () => {
    if (palette.length === 0) {
      alert('Please save at least one style to the palette before randomizing.');
      return;
    }
    const newGrid = grid.map(row =>
      row.map(() => (Math.random() > 0.7 ? null : Math.floor(Math.random() * palette.length)))
    );
    setGrid(newGrid);
  };

  const toggleGridLines = () => setShowGridLines(!showGridLines);

  // Live preview next tile in palette (or empty tile)
  const nextPreviewStyle =
    selectedStyleIndex !== null && palette.length > 0 && selectedStyleIndex < palette.length - 1
      ? palette[selectedStyleIndex + 1]
      : { backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px' };

  return (
    <div className="App">
      <header className="App-header-sticky">
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
          <div className="tile-previews">
            <div className="preview-1x1" style={{ ...tileStyles, width: 50, height: 50 }} />
            <div className="preview-1x1 next" style={nextPreviewStyle} />
            <div
              className="preview-3x3"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 25px)', gridGap: 4 }}
            >
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: i === 4 ? tileStyles.backgroundColor || '#ddd' : 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="center-column">
          <div className="sandbox-controls">
            <button onClick={clearGrid}>Clear Grid</button>
            <button onClick={randomizeGrid}>Randomize Grid</button>
            <button onClick={toggleGridLines}>{showGridLines ? 'Hide Grid Lines' : 'Show Grid Lines'}</button>
          </div>
          <Sandbox
            palette={palette}
            grid={grid}
            paintCell={paintCell}
            showGridLines={showGridLines}
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
