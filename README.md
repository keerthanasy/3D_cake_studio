# 🎂 3D Cake Studio - Frontend Architecture

This project is a high-fidelity 3D web application built to facilitate interactive cake customization. It leverages the power of **WebG**L through modern React ecosystems to deliver a performant and visually stunning experience.

## 🏗️ How It Was Created

The application was scaffolded using **Vite**, chosen for its lightning-fast HMR (Hot Module Replacement) and optimized build process. The core of the 3D experience is built upon **Three.js**, but abstracted through **React Three Fiber (R3F)** to allow for a declarative, component-based approach to 3D scene management.

### Tech Stack & Core Dependencies

*   **React 19**: The view library for building the user interface.
*   **Vite**: Next-generation frontend tooling for fast development and bundling.
*   **React Three Fiber (@react-three/fiber)**: A React renderer for Three.js, treating 3D objects as declarative components.
*   **React Three Drei (@react-three/drei)**: A collection of useful helpers/abstractions for R3F (OrbitControls, Environment, etc.).
*   **Zustand**: A small, fast, and scalable bearbones state-management solution used to track the cake’s configuration globally.
*   **Postprocessing**: Used for visual effects like Bloom and Tone Mapping to achieve a premium "studio" look.

---

## ⚙️ How It Works

The application creates a seamless bridge between the 2D User Interface (UI) and the 3D Scene. Here is a breakdown of the rendering pipeline and logic flow:

### 1. The Entry Point (`main.jsx`)
The app initializes the React root and renders the main `App` component within `src/main.jsx`. This setup ensures strict mode compliance and imports global CSS styles (`index.css`) for the dark, premium theme.

### 2. State Management (`store/useCakeStore.js`)
We use **Zustand** to hold the "Source of Truth" for the cake. The store (`useCakeStore`) tracks:
*   `activeStep`: Which stage of customization the user is in (Shape -> Size -> Flavor -> Toppings).
*   `cakeConfig`: An object containing the current shape, flavor color, icing color, and selected toppings.
*   **Actions**: Functions like `setShape`, `setFlavor`, and `addTopping` that components call to update the state.

### 3. The 3D Scene (`components/Scene.jsx`)
This component renders the `<Canvas>` from R3F. It is responsible for:
*   **Lighting**: Setting up ambient and directional lights to illuminate the cake.
*   **Environment**: Loading HDRI maps (if applicable) or studio backdrops.
*   **Camera Controls**: Implementing `OrbitControls` so users can rotate and zoom around the cake.
*   **Rendering the Model**: It conditionally renders 3D meshes (Cylinders, Boxes, etc.) based on the `cakeConfig.shape` from the store.

### 4. Materials & Shaders
To make the cake look delicious, we don't just use standard colors.
*   **Custom Materials**: Components like `SpongeMaterial.jsx` and `DeliciousMaterials.jsx` use `MeshStandardMaterial` with tweaked roughness and metalness properties to simulate texture.
*   **Shaders**: For complex surfaces like chocolate glaze or fruit textures, we implement custom GLSL shaders (found in `src/shaders/`) to calculate lighting and reflection per-pixel.

### 5. The User Interface (`components/Interface.jsx`)
The 2D UI floats **on top** of the 3D canvas (using `position: absolute` and high z-index).
*   It subscribes to `useCakeStore` to know what to display.
*   When a user clicks a button (e.g., "Add Strawberry"), it dispatches an action to the store.
*   Because React is reactive, the store update triggers a re-render of the 3D Scene components immediately, updating the visual model in real-time.

---

## 📂 Project Structure

```
src/
├── components/        # React components (2D UI & 3D Objects)
│   ├── Scene.jsx      # The R3F Canvas wrapper
│   ├── Interface.jsx  # HTML overlays for controls
│   └── Toppings.jsx   # Logic for placing 3D topping models
├── models/            # 3D material definitions and geometry logic
├── shaders/           # GLSL code for custom visual effects
├── store/             # Global state definitions (Zustand)
├── utils/             # Helper functions for math and geometry
└── App.jsx            # Main layout container
```

## 🚀 Running Locally

1.  Clone the project.
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the local host URL to start designing cakes!
