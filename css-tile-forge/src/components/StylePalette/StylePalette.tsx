
import React from 'react';

interface StylePaletteProps {
  palette: React.CSSProperties[];
  selectedStyleIndex: number | null;
  setSelectedStyleIndex: (index: number | null) => void;
  // Optionally, allow deleting styles in future enhancements
  // onDeleteStyle?: (index: number) => void;
}

const StylePalette: React.FC<StylePaletteProps> = ({
  palette,
  selectedStyleIndex,
  setSelectedStyleIndex,
}) => {
  return (
    <div className="style-palette">
      <h3>Style Palette</h3>
      <div className="palette-tiles" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {palette.length === 0 && <p>No saved styles.</p>}
        {palette.map((style, index) => (
          <button
            key={index}
            onClick={() => setSelectedStyleIndex(index)}
            style={{
              ...style,
              width: 60,
              height: 60,
              border: selectedStyleIndex === index ? '3px solid #007bff' : '1px solid #ccc',
              cursor: 'pointer',
              borderRadius: 4,
              boxSizing: 'border-box',
            }}
            aria-label={`Select style ${index + 1}`}
            title={`Select style ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StylePalette;
