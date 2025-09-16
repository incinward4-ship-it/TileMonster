import React, { useState } from 'react';
import TextureCreator from './components/TextureCreator/TextureCreator';
import Sandbox from './components/Sandbox/Sandbox';
import StylePalette from './components/StylePalette/StylePalette';
import Export from './components/Export/Export';
import { TileStyle } from './data/types';
import styles from './App.module.css';

function App() {
  const [palette, setPalette] = useState<TileStyle[]>([{
    backgroundColor: '#d3d3d3',
    border: 'none',
    borderRadius: 0,
  }]);
  const [activeAttributes, setActiveAttributes] = useState([]);
  const [grid, setGrid] = useState<(number | null)[][]>(Array(16).fill(null).map(() => Array(16).fill(null)));
  const [selectedStyleIndices, setSelectedStyleIndices] = useState<number[]>([0]);
  const [livePreviewStyle, setLivePreviewStyle] = useState<React.CSSProperties>({});
  const [isBlendMode, setIsBlendMode] = useState(false);
  
  const saveToPalette = (style: TileStyle) => {
    setPalette([...palette, style]);
  };

  const updatePaletteStyle = (index: number, newStyle: TileStyle) => {
      const newPalette = [...palette];
      newPalette[index] = newStyle;
      setPalette(newPalette);
  };

  const updateSelectedStyle = () => {
    if (selectedStyleIndices.length !== 1) return;
    const index = selectedStyleIndices[0];
    updatePaletteStyle(index, activeAttributes.reduce((acc, attr) => {
      acc[attr.definition.id] = attr.value;
      return acc;
    }, {}));
  };

  const evolveSelectedStyles = () => {
      if (selectedStyleIndices.length !== 2) return;

      const [index1, index2] = selectedStyleIndices;
      const newStyle = evolveStyle(palette[index1], palette[index2]);

      setPalette([...palette, newStyle]);
  };

  const deleteSelectedStyles = () => {
    const newPalette = palette.filter((_, index) => !selectedStyleIndices.includes(index));
    setPalette(newPalette);
    setSelectedStyleIndices([0]);
  };

  const paintCell = (row: number, col: number) => {
    if (selectedStyleIndices.length === 0) return;
    const newGrid = grid.map((rowArr, rowIndex) =>
      rowIndex === row ? rowArr.map((cell, colIndex) => (colIndex === col ? selectedStyleIndices[0] : cell)) : rowArr
    );
    setGrid(newGrid);
  };

  const clearGrid = () => {
    setGrid(Array(16).fill(null).map(() => Array(16).fill(null)));
  };

  const randomizeGrid = () => {
    const newGrid = grid.map(row => row.map(() => Math.floor(Math.random() * palette.length)));
    setGrid(newGrid);
  };

  const buildCompleteStyleForPreview = () => {
    if (selectedStyleIndices.length !== 1) return {};

    const selectedStyle = palette[selectedStyleIndices[0]];
    setLivePreviewStyle(selectedStyle);
  };

  const onBlendChange = (isBlended: boolean) => {
    const index = selectedStyleIndices[0];
    if (index === undefined) return;

    const newPalette = [...palette];
    newPalette[index] = { ...newPalette[index], blend: isBlended };
    setPalette(newPalette);
    setIsBlendMode(isBlended);
  };

  const evolveStyle = (style1: TileStyle, style2: TileStyle): TileStyle => {
    const childStyle: TileStyle = {};
    const allKeys = Array.from(new Set([...Object.keys(style1), ...Object.keys(style2)])) as (keyof TileStyle)[];

    allKeys.forEach(key => {
      if (key === 'blend') return;
      const fromParent1 = style1[key] !== undefined;
      const fromParent2 = style2[key] !== undefined;

      if (fromParent1 && fromParent2) {
        // 50% for 1 from style 1, 50% for 2nd in style 2
        childStyle[key] = Math.random() < 0.5 ? style1[key] : style2[key];
      } else if (fromParent1) {
        //Add keys that arnt even in style 2
        childStyle[key] = style1[key];
      } else if (fromParent2) {
        //Add keys that arnt even in style 1
        childStyle[key] = style2[key];
      }
    });
    // Return a NEW TileStyle object instead of modifying one
    return { ...childStyle };
  };

  return (
    <div className="app">
      <h1>Tile Monster</h1>
      <div className={styles.container}>
        <div className={styles.texturePaletteContainer}>
          <TextureCreator
            saveToPalette={saveToPalette}
            activeAttributes={activeAttributes}
            setActiveAttributes={setActiveAttributes}
            tileStyles={palette[selectedStyleIndices[0]]}
          />
          <StylePalette
            palette={palette}
            selectedStyleIndices={selectedStyleIndices}
            setSelectedStyleIndices={setSelectedStyleIndices}
            onUpdate={updateSelectedStyle}
            onEvolve={evolveSelectedStyles}
            onDelete={deleteSelectedStyles}
            livePreviewStyle={livePreviewStyle}
          />
          
        </div>
        <div className={styles.sandboxExportContainer}>
          <Sandbox
            palette={palette}
            grid={grid}
            paintCell={paintCell}
            clearGrid={clearGrid}
            randomizeGrid={randomizeGrid}
            setGrid={setGrid}
          />
          <Export palette={palette} grid={grid} />
        </div>
      </div>
    </div>
  );
}

export default App;