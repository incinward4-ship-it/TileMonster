import React from 'react';
import { TileStyle } from '../../data/types';
import { buildCompleteStyle } from '../../utils/styleHelpers';

interface StylePaletteProps {
  palette: TileStyle[];
  selectedStyleIndices: number[];
  setSelectedStyleIndices: (indices: number[]) => void;
  onUpdate: () => void;
  onEvolve: () => void;
  onDelete: () => void;
  livePreviewStyle?: React.CSSProperties;
}

const StylePalette: React.FC<StylePaletteProps> = ({
  palette,
  selectedStyleIndices,
  setSelectedStyleIndices,
  onUpdate,
  onEvolve,
  onDelete,
  livePreviewStyle,
}) => {
  const handleTileClick = (index: number) => {
    const currentIndex = selectedStyleIndices.indexOf(index);

    let newSelected: number[];

    if (currentIndex === -1) {
      // Add the index to the selected styles
      newSelected = [...selectedStyleIndices, index];
    } else {
      // Remove the index from the selected styles
      newSelected = selectedStyleIndices.filter(i => i !== index);
    }

    setSelectedStyleIndices(newSelected);
  };

  const getBorderStyle = (index: number) => {
    const selectionIndex = selectedStyleIndices.indexOf(index);
    if (selectionIndex === -1) return '1px solid #ccc';

    if (selectedStyleIndices.length === 2) {
      if (selectionIndex === 0) return '3px solid gold';
      if (selectionIndex === 1) return '3px solid silver';
    }
    
    return '3px solid #007bff';
  };

  return (
    <div className="style-palette">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h3>Style Palette ({palette.length})</h3>
        <button
          className='palette-action-button'
          onClick={onUpdate}
          disabled={selectedStyleIndices.length !== 1}
          title="Update selected style (requires 1 style)"
        >
          Update
        </button>
        <button
         className='palette-action-button'
          onClick={onEvolve}
          disabled={selectedStyleIndices.length !== 2}
          title="Evolve selected styles (requires 2 styles)"
        >
          Evolve
        </button>
        <button
          className='palette-action-button'
          onClick={onDelete}
          disabled={selectedStyleIndices.length === 0}
          title="Delete selected styles"
        >
          Delete
        </button>
      </div>
      <div className="palette-tiles" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {palette.length === 0 && <p style={{ color: '#ccc', fontSize: '12px', margin: 0 }}>No saved styles.</p>}
        {palette.map((style, index) => {
          const isSelected = selectedStyleIndices.includes(index) && selectedStyleIndices.length === 1;
          const displayStyle = isSelected ? livePreviewStyle : buildCompleteStyle(style);
          
          return (
            <button
              className="palette-tile"
              key={index}
              onClick={() => handleTileClick(index)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                width: 44,
                height: 44,
                minWidth: 'auto',
              }}
              aria-label={`Select style ${index + 1}`}
              title={`Select style ${index + 1}`}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  border: getBorderStyle(index),
                  borderRadius: 6,
                  padding: 2,
                  boxSizing: 'border-box',
                }}
              >
                <div 
                  style={{
                    ...displayStyle,
                    width: '100%',
                    height: '100%',
                    borderRadius: 3,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StylePalette;
