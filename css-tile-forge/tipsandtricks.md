# The Tale of the Blended Borders: Eliminating Code Duplication

## The Problem

In the `Tile Monster` application, the `Sandbox` and `Preview` components both used similar logic to handle the `blend` property, which dynamically adjusts the borders and border radius of tiles based on their neighbors. This resulted in code duplication, making the application harder to maintain and evolve.

## The Solution

To address this, we created a new utility function called `applyBlendStyles` in `css-tile-forge/src/utils/blendHelpers.ts`. This function encapsulates the `blend` property logic and takes the following arguments:

*   `style`: The base style object.
*   `grid`: The grid data.
*   `row`: The row index of the cell.
*   `col`: The column index of the cell.
*   `gridDimensions`: The dimensions of the grid.
*   `paletteIndex`: The index of the tile style in the palette.
*   `isBlendMode`: A boolean indicating whether blend mode is enabled.
* `rawTileStyle`: the raw tile style to determine if blend is enabled.

The function modifies the `style` object based on the `blend` property and returns the modified style object.

## The Implementation

1.  Created the `css-tile-forge/src/utils/blendHelpers.ts` file with the `applyBlendStyles` function.
2.  Modified `Sandbox.tsx` and `Preview.tsx` to import and use the `applyBlendStyles` function.
3.  Removed the duplicated code that was handling the `blend` property from `Sandbox.tsx` and `Preview.tsx`.

## The Result

The code duplication was eliminated, making the application easier to maintain and evolve. The `applyBlendStyles` function provides a single source of truth for the `blend` property logic, ensuring consistency across the application.

## The Lesson

When faced with code duplication, consider extracting the duplicated logic into a reusable function or component. This promotes code reuse, improves maintainability, and enhances the overall harmony of the application.