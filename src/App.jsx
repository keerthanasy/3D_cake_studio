import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { Scene } from './components/Scene';
import { Interface } from './components/Interface';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './pages/LandingPage';
import './App.css';

function App() {
  const [showStudio, setShowStudio] = useState(false);

  // Show landing page first, then 3D studio when user clicks
  if (!showStudio) {
    return <LandingPage onEnterStudio={() => setShowStudio(true)} />;
  }

  // 3D Cake Studio
  return (
    <div className="app-container">
      {/* Back to Home Button */}
      <button
        className="back-to-home-btn"
        onClick={() => setShowStudio(false)}
        title="Back to Home"
      >
        ← Back to Home
      </button>

      <div className="canvas-section">
        <Canvas
          shadows
          camera={{ position: [4, 4, 6], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="ui-sidebar">
        <h1 className="app-title">Cake Studio 3D</h1>
        <Interface />
      </div>

      {/* Loading Screen - connects to R3F useProgress under the hood */}
      <LoadingScreen />
    </div>
  );
}

export default App;
