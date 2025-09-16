import { TileStyle } from '../data/types';
import React from 'react';

interface GridDimensions {
    rows: number;
    cols: number;
}

export const applyBlendStyles = (
    style: React.CSSProperties,
    grid: (number | null)[][],
    row: number,
    col: number,
    gridDimensions: GridDimensions,
    paletteIndex: number | null | undefined,
    isBlendMode: boolean,
    rawTileStyle: TileStyle
): React.CSSProperties => {
    if (!rawTileStyle.blend) {
        return style;
    }

    const { rows, cols } = gridDimensions;
    const isSameTile = (r: number, c: number) => grid[r]?.[c] === paletteIndex;

    const hasTop = row > 0 && isSameTile(row - 1, col);
    const hasBottom = row < rows - 1 && isSameTile(row + 1, col);
    const hasLeft = col > 0 && isSameTile(row, col - 1);
    const hasRight = col < cols - 1 && isSameTile(row, col + 1);

    if (hasTop) {
        style.borderTop = 'none';
        style.boxShadow = 'none';
    }
    if (hasBottom) {
        style.borderBottom = 'none';
        style.boxShadow = 'none';
    }
    if (hasLeft) {
        style.borderLeft = 'none';
        style.boxShadow = 'none';
    }
    if (hasRight) {
        style.borderRight = 'none';
        style.boxShadow = 'none';
    }

    if (hasTop || hasLeft) style.borderTopLeftRadius = 0;
    if (hasTop || hasRight) style.borderTopRightRadius = 0;
    if (hasBottom || hasLeft) style.borderBottomLeftRadius = 0;
    if (hasBottom || hasRight) style.borderBottomRightRadius = 0;

    return style;
};