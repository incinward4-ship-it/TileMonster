
import { CssAttribute } from './types'; // Assuming types are moved to a separate file

// A master list of all supported CSS attributes for the dropdown.
export const CSS_ATTRIBUTES: CssAttribute[] = [
  {
    id: 'backgroundColor',
    label: 'Background Color',
    category: 'Background',
    controlType: 'color',
    defaultValue: '#FFFFFF',
  },
  {
    id: 'backgroundImage',
    label: 'Background Image',
    category: 'Background',
    controlType: 'gradient',
    defaultValue: { angle: 90, color1: '#FFFFFF', color2: '#000000' },
  },
  {
    id: 'backgroundPosition',
    label: 'Background Position',
    category: 'Background',
    controlType: 'text',
    defaultValue: 'center',
  },
  {
    id: 'backgroundSize',
    label: 'Background Size',
    category: 'Background',
    controlType: 'text',
    defaultValue: 'cover',
  },
  {
    id: 'backgroundRepeat',
    label: 'Background Repeat',
    category: 'Background',
    controlType: 'select',
    defaultValue: 'no-repeat',
    options: [
        { value: 'repeat', label: 'Repeat' }, 
        { value: 'no-repeat', label: 'No Repeat' },
        { value: 'repeat-x', label: 'Repeat X' }, 
        { value: 'repeat-y', label: 'Repeat Y' }, 
        { value: 'space', label: 'Space' }, 
        { value: 'round', label: 'Round' }
    ],
  },
  {
    id: 'borderWidth',
    label: 'Border Width',
    category: 'Border',
    controlType: 'slider',
    min: 0,
    max: 50,
    step: 1,
    defaultValue: 1,
  },
  {
    id: 'borderStyle',
    label: 'Border Style',
    category: 'Border',
    controlType: 'select',
    defaultValue: 'solid',
    options: [
        { value: 'none', label: 'None' }, 
        { value: 'solid', label: 'Solid' }, 
        { value: 'dotted', label: 'Dotted' }, 
        { value: 'dashed', label: 'Dashed' }, 
        { value: 'double', label: 'Double' }, 
        { value: 'groove', label: 'Groove' }, 
        { value: 'ridge', label: 'Ridge' }, 
        { value: 'inset', label: 'Inset' }, 
        { value: 'outset', label: 'Outset' }
    ],
  },
  {
    id: 'borderColor',
    label: 'Border Color',
    category: 'Border',
    controlType: 'color',
    defaultValue: '#000000',
  },
  {
    id: 'borderRadius',
    label: 'Border Radius',
    category: 'Border',
    controlType: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
  },
  {
    id: 'boxShadow',
    label: 'Box Shadow',
    category: 'Shadow',
    controlType: 'multi',
    defaultValue: {
      offsetX: 2,
      offsetY: 2,
      blurRadius: 5,
      spreadRadius: 0,
      color: '#00000080',
      inset: false,
    },
    subAttributes: [
      { id: 'offsetX', label: 'X Offset', controlType: 'slider', min: -50, max: 50, step: 1, defaultValue: 2 },
      { id: 'offsetY', label: 'Y Offset', controlType: 'slider', min: -50, max: 50, step: 1, defaultValue: 2 },
      { id: 'blurRadius', label: 'Blur Radius', controlType: 'slider', min: 0, max: 100, step: 1, defaultValue: 5 },
      { id: 'spreadRadius', label: 'Spread Radius', controlType: 'slider', min: -50, max: 50, step: 1, defaultValue: 0 },
      { id: 'color', label: 'Color', controlType: 'color', defaultValue: '#00000080' },
      { id: 'inset', label: 'Inset', controlType: 'checkbox', defaultValue: false },
    ],
  },
  {
    id: 'filter',
    label: 'Filter Effects',
    category: 'Filter',
    controlType: 'multi',
    defaultValue: {
        blur: 0, 
        brightness: 1, 
        contrast: 1, 
        grayscale: 0, 
        hueRotate: 0, 
        invert: 0, 
        opacity: 1, 
        saturate: 1, 
        sepia: 0
    },
    subAttributes: [
      { id: 'blur', label: 'Blur (px)', controlType: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 0 },
      { id: 'brightness', label: 'Brightness', controlType: 'slider', min: 0, max: 2, step: 0.01, defaultValue: 1 },
      { id: 'contrast', label: 'Contrast', controlType: 'slider', min: 0, max: 2, step: 0.01, defaultValue: 1 },
      { id: 'grayscale', label: 'Grayscale', controlType: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0 },
      { id: 'hueRotate', label: 'Hue Rotate (deg)', controlType: 'slider', min: 0, max: 360, step: 1, defaultValue: 0 },
      { id: 'invert', label: 'Invert', controlType: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0 },
      { id: 'opacity', label: 'Opacity', controlType: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 1 },
      { id: 'saturate', label: 'Saturate', controlType: 'slider', min: 0, max: 3, step: 0.01, defaultValue: 1 },
      { id: 'sepia', label: 'Sepia', controlType: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0 },
    ],
  },
  {
    id: 'transform',
    label: 'Transform',
    category: 'Transform',
    controlType: 'multi',
    defaultValue: { translateX: 0, translateY: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    subAttributes: [
      { id: 'translateX', label: 'Translate X (px)', controlType: 'slider', min: -100, max: 100, step: 1, defaultValue: 0 },
      { id: 'translateY', label: 'Translate Y (px)', controlType: 'slider', min: -100, max: 100, step: 1, defaultValue: 0 },
      { id: 'rotate', label: 'Rotate (deg)', controlType: 'slider', min: 0, max: 360, step: 1, defaultValue: 0 },
      { id: 'scaleX', label: 'Scale X', controlType: 'slider', min: 0, max: 5, step: 0.01, defaultValue: 1 },
      { id: 'scaleY', label: 'Scale Y', controlType: 'slider', min: 0, max: 5, step: 0.01, defaultValue: 1 },
    ],
  },
  {
    id: 'clipPath',
    label: 'Clip Path',
    category: 'Shape',
    controlType: 'select',
    defaultValue: 'none',
    options: [
        {value: 'none', label: 'None'},
        {value: 'circle(50% at 50% 50%)', label: 'Circle'},
        {value: 'ellipse(50% 25% at 50% 50%)', label: 'Ellipse'},
        {value: 'inset(10% 20% 30% 40%)', label: 'Inset'},
        {value: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)', label: 'Polygon'}
    ]
  },
];

// We can define a separate type definition file if it becomes complex.
export interface CssAttribute {
  id: string;
  label: string;
  category: string;
  controlType: 'color' | 'slider' | 'select' | 'text' | 'multi' | 'gradient' | 'checkbox';
  defaultValue: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  subAttributes?: Omit<CssAttribute, 'category' | 'subAttributes'>[];
}
