
import { CssAttribute } from './types';

export const CSS_ATTRIBUTES: CssAttribute[] = [
  {
    id: 'backgroundColor',
    label: 'Background Color',
    category: 'Background',
    controlType: 'color',
    defaultValue: '#FFFFFF',
  },
  {
    id: 'backgroundGradient',
    label: 'Background Gradient',
    category: 'Background',
    controlType: 'gradient',
    defaultValue: {
      type: 'linear',
      angle: 90,
      colors: ['#FFFFFF', '#000000'],
    },
  },
  {
    id: 'borderTop',
    label: 'Border Top',
    category: 'Border',
    controlType: 'multi',
    defaultValue: {
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: '#000000',
      borderTopRadius: 0,
    },
    subAttributes: [
      { id: 'borderTopWidth', label: 'Width', controlType: 'slider', min: 0, max: 10, step: 1, defaultValue: 1 },
      { id: 'borderTopStyle', label: 'Style', controlType: 'select', options: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ], defaultValue: 'solid' },
      { id: 'borderTopColor', label: 'Color', controlType: 'color', defaultValue: '#000000' },
      { id: 'borderTopRadius', label: 'Radius', controlType: 'slider', min: 0, max: 50, step: 1, defaultValue: 0 },
    ],
  },
  {
    id: 'borderRight',
    label: 'Border Right',
    category: 'Border',
    controlType: 'multi',
    defaultValue: {
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: '#000000',
      borderRightRadius: 0,
    },
    subAttributes: [
      { id: 'borderRightWidth', label: 'Width', controlType: 'slider', min: 0, max: 10, step: 1, defaultValue: 1 },
      { id: 'borderRightStyle', label: 'Style', controlType: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ], defaultValue: 'solid' },
      { id: 'borderRightColor', label: 'Color', controlType: 'color', defaultValue: '#000000' },
      { id: 'borderRightRadius', label: 'Radius', controlType: 'slider', min: 0, max: 50, step: 1, defaultValue: 0 },
    ],
  },
  {
    id: 'borderBottom',
    label: 'Border Bottom',
    category: 'Border',
    controlType: 'multi',
    defaultValue: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: '#000000',
      borderBottomRadius: 0,
    },
    subAttributes: [
      { id: 'borderBottomWidth', label: 'Width', controlType: 'slider', min: 0, max: 10, step: 1, defaultValue: 1 },
      { id: 'borderBottomStyle', label: 'Style', controlType: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ], defaultValue: 'solid' },
      { id: 'borderBottomColor', label: 'Color', controlType: 'color', defaultValue: '#000000' },
      { id: 'borderBottomRadius', label: 'Radius', controlType: 'slider', min: 0, max: 50, step: 1, defaultValue: 0 },
    ],
  },
  {
    id: 'borderLeft',
    label: 'Border Left',
    category: 'Border',
    controlType: 'multi',
    defaultValue: {
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: '#000000',
      borderLeftRadius: 0,
    },
    subAttributes: [
      { id: 'borderLeftWidth', label: 'Width', controlType: 'slider', min: 0, max: 10, step: 1, defaultValue: 1 },
      { id: 'borderLeftStyle', label: 'Style', controlType: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ], defaultValue: 'solid' },
      { id: 'borderLeftColor', label: 'Color', controlType: 'color', defaultValue: '#000000' },
      { id: 'borderLeftRadius', label: 'Radius', controlType: 'slider', min: 0, max: 50, step: 1, defaultValue: 0 },
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
      sepia: 0,
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
    defaultValue: {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    },
    subAttributes: [
      { id: 'translateX', label: 'Translate X (px)', controlType: 'slider', min: -100, max: 100, step: 1, defaultValue: 0 },
      { id: 'translateY', label: 'Translate Y (px)', controlType: 'slider', min: -100, max: 100, step: 1, defaultValue: 0 },
      { id: 'rotate', label: 'Rotate (deg)', controlType: 'slider', min: 0, max: 360, step: 1, defaultValue: 0 },
      { id: 'scaleX', label: 'Scale X', controlType: 'slider', min: 0, max: 5, step: 0.01, defaultValue: 1 },
      { id: 'scaleY', label: 'Scale Y', controlType: 'slider', min: 0, max: 5, step: 0.01, defaultValue: 1 },
    ],
  },
];

// We can define a separate type definition file if it becomes complex.
export interface CssAttribute {
  id: string;
  label: string;
  category: string;
  controlType: 'color' | 'slider' | 'select' | 'text' | 'multi' | 'gradient' | 'checkbox' | 'button';
  defaultValue: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  subAttributes?: Omit<CssAttribute, 'category' | 'subAttributes'>[];
}
