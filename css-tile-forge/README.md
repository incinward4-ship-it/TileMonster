# CSS-Tile-Forge

CSS-Tile-Forge is a web-based application designed to be an intuitive and powerful tool for creating, composing, and exporting tileable CSS textures. It allows you to design individual tile styles and "paint" them onto a responsive canvas to create complex and beautiful patterns.

## Key Features

- **Live Style Editor:** Design individual tile "stamps" using a comprehensive set of CSS attributes in the `TextureCreator`.
- **Real-time Previews:** See your style updates instantly in a large header logo, a 1x1 tile, and a 3x3 grid with blend-mode simulation.
- **Style Palette:** Save your creations to a palette for later use.
- **Responsive Painting Canvas:** The `Sandbox` is a dynamic grid that automatically resizes to fill the available space, from a 16x16 minimum up to a 64x64 maximum.
- **Zoom & Pan:** Zoom in for detailed work or zoom out for a wider view with three distinct zoom levels. 
- **Paint & Compose:** Select styles from your palette and paint them directly onto the grid. Click and drag to paint multiple tiles at once.
- **Export CSS:** Generate the complete CSS for your entire composition, including all the different tile styles used.

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

---

## Developer Notes for Takeover

Hello! This project has undergone a significant architectural refactor to introduce a responsive sandbox, zoom functionality, and a more robust layout. Here is a summary of the current architecture and status:

### Current Status

The application is in a stable, feature-rich state. The primary layout is a responsive three-column design, and the sandbox is fully interactive. The next steps would involve expanding the available CSS properties in the `TextureCreator` and adding more advanced features like style deletion from the palette or multi-layer support.

### Architecture Overview

*   **`App.tsx`:** This is the main component and acts as the single source of truth for the application's core state. It manages the `palette`, the master `grid` data, `selectedStyleIndex`, `activeAttributes` (for the creator), and the current `tileStyles` being edited. It is no longer responsible for the sandbox's internal state like zoom or grid dimensions.
*   **Component Structure:**
    *   **Header:** The header is a sticky element that contains the large logo preview (which updates in real-time), the application title, and the `StylePalette`.
    *   **`TextureCreator` (Left Column):** Allows the user to define a CSS style. It is passed the current `tileStyles` and `activeAttributes` and uses callbacks to update the state in `App.tsx`.
    *   **`Sandbox` (Center Column):** This is now a more independent and intelligent component. It manages its own state for `zoomLevel`, `showGridLines`, and the visible `gridDimensions`. It uses a `ResizeObserver` to dynamically calculate its own size based on the container and the current zoom level. It receives the master `grid` data from `App.tsx` but is responsible for rendering only the visible portion.
    *   **`Export` (Right Column):** Displays the generated CSS for the grid and palette in a compact format.
*   **Data Flow:** The application follows a standard React unidirectional data flow. Core application state is held in `App.tsx` and passed down. The `Sandbox` component now manages its own UI state, but when it needs to modify the application's data (like painting a tile or resizing the grid), it communicates back up to `App.tsx` via callbacks (`paintCell`, `setGrid`).
*   **Styling:** Styling is managed through a single, global stylesheet: `src/App.css`. It uses standard CSS and class names to style the components and the responsive layout.

### Key Accomplishments

*   **Responsive Sandbox:** The sandbox now uses a `ResizeObserver` and CSS Grid with `auto-fit` to dynamically calculate and render the optimal number of tiles to fill the available space.
*   **Zoom Functionality:** The sandbox supports three zoom levels (12px, 18px, and 24px cells), allowing the user to work at different levels of detail.
*   **Decoupled Sandbox State:** The `Sandbox` component now manages its own resizing and zoom state, making the component more modular and the overall application easier to reason about.
*   **Live Logo Preview:** A large, 60x60px tile in the header provides immediate, prominent visual feedback on the style being created.
*   **Improved Layout:** The application now has a stable and responsive three-column layout, with the sandbox taking up the flexible central space.

The project is now in your hands. Good luck with the next phase of development!