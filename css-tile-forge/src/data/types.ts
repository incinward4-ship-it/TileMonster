
import React from 'react';

// Defines the structure for a CSS attribute in the master list
export interface CssAttribute {
  id: string; // Used for state and maps to a CSS property (camelCase)
  label: string; // Display name in the UI
  category: string; // For grouping in the dropdown
  controlType: 'color' | 'slider' | 'select' | 'text' | 'multi' | 'gradient' | 'checkbox';
  defaultValue: any;
  // For 'select'
  options?: { value: string; label: string }[];
  // For 'slider'
  min?: number;
  max?: number;
  step?: number;
  // For 'multi'
  subAttributes?: Omit<CssAttribute, 'category' | 'subAttributes'>[];
}

// Represents an attribute that has been added to the style
export interface ActiveAttribute {
  id: string; // Unique ID for this instance of the attribute
  definition: CssAttribute;
  value: any;
}

// Defines the structure for a single tile's style, including blend and transform
export type TileStyle = React.CSSProperties & { 
  blend?: boolean; 
  transform?: string; 
};
