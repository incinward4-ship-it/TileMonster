# CSS-Tile-Forge

CSS-Tile-Forge is a web-based application designed to be an intuitive and powerful tool for creating, composing, and exporting tileable CSS textures. It allows you to design individual tile styles and "paint" them onto a canvas to create complex and beautiful patterns.

## Project Vision

The ultimate goal of CSS-Tile-Forge is to transform it from a simple CSS generator into a "Photoshop for CSS tiles." The user should be able to:

1.  **Design Tile "Stamps":** In the "Texture Creator," design a single tile style by combining a comprehensive library of CSS properties. This design process is isolated and does not affect the main canvas.
2.  **Save Styles to a Palette:** Once a style is perfected, a "Save to Sandbox" button adds this style as a new "stamp" or "sticker" to a style palette.
3.  **Paint with Styles:** The palette of saved styles appears above the main grid. The user can select a style from the palette and then click on cells in the main grid to "paint" with that style, creating a composite texture.
4.  **Compose and Export:** The main grid becomes a canvas for composing different tile styles together. The final result can be exported as a single CSS file.

## Development Roadmap

To achieve the project vision, the following tasks need to be completed:

### Phase 1: Core Functionality and Bug Fixes

1.  **Fix Layout Bugs:**
    *   Correct the CSS for the 3x3 preview grid to ensure it displays as 3 columns.
    *   Reposition the "Export" section to prevent it from overlapping the main grid.
2.  **Isolate Style Creation:**
    *   Decouple the `TextureCreator` from the main `Sandbox` grid. Changes in the creator should only be reflected in the 1x1 and 3x3 previews, not the main grid.
3.  **Implement Style Palette:**
    *   Create a new `StylePalette` component to display saved styles.
    *   Add a "Save to Sandbox" button to the `TextureCreator` that adds the current style to the `StylePalette`.
4.  **Implement Painting Functionality:**
    *   Enable selection of a style from the `StylePalette`.
    *   Add click handlers to the `Sandbox` grid cells to apply the selected style.

### Phase 2: Feature Enhancements

1.  **Expand CSS Properties:**
    *   Research and add a comprehensive list of CSS properties to the "Add Attribute" dropdown. This should include properties for `border`, `box-shadow`, `transform`, `filter`, and more.
2.  **Improve UI/UX:**
    *   Add visual feedback for the currently selected style in the palette.
    *   Implement "Clear" and "Randomize" functionality for the main grid.
    *   Allow for deletion of styles from the palette.
3.  **Enhance Export Functionality:**
    *   Update the export functionality to generate CSS for the entire composed grid, which may involve creating multiple CSS classes for the different styles used.

## Getting Started

This project is built with React and TypeScript. To run it, you will need to have Node.js and a package manager like npm installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run start
    ```

This will start the React development server and open the application in your browser.
