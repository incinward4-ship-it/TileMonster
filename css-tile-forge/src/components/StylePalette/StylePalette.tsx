import React from 'react';
import { TileStyle } from '../../data/types';

interface StylePaletteProps {
  palette: TileStyle[];
  selectedStyleIndex: number | null;
  setSelectedStyleIndex: (index: number | null) => void;
}

const StylePalette: React.FC<StylePaletteProps> = ({
  palette,
  selectedStyleIndex,
  setSelectedStyleIndex,
}) => {
  return (
    <div className="style-palette">
      <h3>Style Palette ({palette.length})</h3>
      <div className="palette-tiles" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {palette.length === 0 && <p style={{ color: '#ccc', fontSize: '12px', margin: 0 }}>No saved styles.</p>}
        {palette.map((style, index) => {
          // Create a clean style object without the 'blend' property for display
          const displayStyle = { ...style };
          delete displayStyle.blend;
          
          return (
            <button
              key={index}
              onClick={() => setSelectedStyleIndex(index)}
              style={{
                ...displayStyle,
                width: 40,
                height: 40,
                border: selectedStyleIndex === index ? '3px solid #007bff' : '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: 4,
                boxSizing: 'border-box',
                padding: 0,
                minWidth: 'auto',
              }}
              aria-label={`Select style ${index + 1}`}
              title={`Select style ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StylePalette;
