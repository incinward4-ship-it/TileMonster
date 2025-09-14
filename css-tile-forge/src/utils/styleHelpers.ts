import { TileStyle } from '../data/types';
import React from 'react';

export function buildTransformString(transformVal: any): string {
  if (!transformVal) return 'none';
  const parts = [];
  if (transformVal.translateX !== undefined && transformVal.translateX !== 0) parts.push(`translateX(${transformVal.translateX}px)`);
  if (transformVal.translateY !== undefined && transformVal.translateY !== 0) parts.push(`translateY(${transformVal.translateY}px)`);
  if (transformVal.rotate !== undefined && transformVal.rotate !== 0) parts.push(`rotate(${transformVal.rotate}deg)`);
  if (transformVal.scaleX !== undefined && transformVal.scaleX !== 1) parts.push(`scaleX(${transformVal.scaleX})`);
  if (transformVal.scaleY !== undefined && transformVal.scaleY !== 1) parts.push(`scaleY(${transformVal.scaleY})`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function buildFilterString(filterVal: any): string {
  if (!filterVal) return 'none';
  const filters: string[] = [];
  
  if (filterVal.blur !== undefined && filterVal.blur > 0) {
    filters.push(`blur(${filterVal.blur}px)`);
  }
  if (filterVal.brightness !== undefined && filterVal.brightness !== 1) {
    filters.push(`brightness(${filterVal.brightness})`);
  }
  if (filterVal.contrast !== undefined && filterVal.contrast !== 1) {
    filters.push(`contrast(${filterVal.contrast})`);
  }
  if (filterVal.grayscale !== undefined && filterVal.grayscale > 0) {
    filters.push(`grayscale(${filterVal.grayscale})`);
  }
  if (filterVal.hueRotate !== undefined && filterVal.hueRotate > 0) {
    filters.push(`hue-rotate(${filterVal.hueRotate}deg)`);
  }
  if (filterVal.invert !== undefined && filterVal.invert > 0) {
    filters.push(`invert(${filterVal.invert})`);
  }
  if (filterVal.saturate !== undefined && filterVal.saturate !== 1) {
    filters.push(`saturate(${filterVal.saturate})`);
  }
  if (filterVal.sepia !== undefined && filterVal.sepia > 0) {
    filters.push(`sepia(${filterVal.sepia})`);
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
}

export function buildGradientString(gradientVal: any): string {
  if (!gradientVal || !gradientVal.colors || gradientVal.colors.length < 2) {
    return '';
  }

  const { type = 'linear', angle = 90, colors } = gradientVal;
  
  if (type === 'radial') {
    return `radial-gradient(circle, ${colors.join(', ')})`;
  }
  
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

export const buildCompleteStyle = (tileStyle: TileStyle): React.CSSProperties => {
    const newStyles: React.CSSProperties = {};
    for (const key in tileStyle) {
        const value = tileStyle[key as keyof TileStyle];
        if (value === undefined || value === null) continue;

        switch (key) {
            case 'backgroundColor':
                newStyles.backgroundColor = value as string;
                break;
            case 'backgroundImage':
                if (typeof value === 'object' && value !== null && (value as any).colors) {
                    newStyles.backgroundImage = buildGradientString(value);
                }
                break;
            case 'border':
            case 'borderTop':
            case 'borderRight':
            case 'borderBottom':
            case 'borderLeft':
                if (typeof value === 'object' && value !== null) {
                    const border = value as { width: number; style: string; color: string };
                    newStyles[key] = `${border.width}px ${border.style} ${border.color}`;
                }
                break;
            case 'borderRadius':
                newStyles.borderRadius = `${value}px`;
                break;
            case 'opacity':
                newStyles.opacity = value as number;
                break;
            case 'boxShadow':
                if (typeof value === 'object' && value !== null) {
                    const shadow = value as { x: number; y: number; blur: number; spread: number; color: string };
                    newStyles.boxShadow = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                }
                break;
            case 'transform':
                if (typeof value === 'object' && value !== null) {
                    newStyles.transform = buildTransformString(value);
                }
                break;
            case 'filter':
                if (typeof value === 'object' && value !== null) {
                    newStyles.filter = buildFilterString(value);
                }
                break;
            default:
                // For any other CSS properties that are directly assignable
                if (key !== 'blend') {
                    (newStyles as any)[key] = value;
                }
                break;
        }
    }
    return newStyles;
};