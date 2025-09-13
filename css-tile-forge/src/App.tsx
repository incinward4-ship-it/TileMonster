
import React, { useState, useEffect } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import Export from './components/Export/Export';
import StylePalette from './components/StylePalette/StylePalette';
import Preview from './components/Preview/Preview';
import { TileStyle, ActiveAttribute } from './data/types';
import { CSS_ATTRIBUTES } from './data/css-attributes';
import { buildTransformString } from './utils/styleHelpers';
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
        case 'backgroundPosition': newStyles.backgroundPosition = value; break;
        case 'backgroundSize': newStyles.backgroundSize = value; break;
        case 'backgroundRepeat': newStyles.backgroundRepeat = value; break;
        case 'clipPath': newStyles.clipPath = value; break;

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
                if(side === 'Top') {
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
      }
    });

    if (gradients.length > 0) newStyles.backgroundImage = gradients.join(', ');
    if (filters.length > 0) newStyles.filter = filters.join(' ');
    if (transformAttr) {
        newStyles.transform = buildTransformString(transformAttr);
    }

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
      <header className="App-header"><h1>CSS-Tile-Forge</h1></header>
      <main
        className="App-main"
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gridTemplateRows: '1fr auto auto',
          rowGap: '20px',
          height: '100vh',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* First column: Texture Creator */}
        <div className="left-column" style={{ gridRow: '1 / 4' }}>
            <TextureCreator
                saveToPalette={saveStyleToPalette}
                activeAttributes={activeAttributes}
                setActiveAttributes={setActiveAttributes}
                tileStyles={tileStyles}
            />
        </div>

        {/* Second column row 1: Sandbox */}
        <div className="center-column" style={{ gridRow: '1 / 2' }}>
            <Sandbox
                palette={palette}
                grid={grid}
                paintCell={paintCell}
                clearGrid={clearGrid}
                randomizeGrid={randomizeGrid}
            />
        </div>

        {/* Second column row 2: Preview */}
        <div className="center-column-preview" style={{ gridRow: '2 / 3' }}>
            <Preview
                tileStyles={tileStyles}
                isBlendMode={isBlendMode}
                onBlendChange={setIsBlendMode}
            />
        </div>

        {/* Second column row 3: Style Palette */}
        <div className="center-column-palette" style={{ gridRow: '3 / 4' }}>
            <StylePalette
                palette={palette}
                selectedStyleIndex={selectedStyleIndex}
                setSelectedStyleIndex={setSelectedStyleIndex}
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
