import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { Cake } from './Cake';
import { SnapshotListener } from './SnapshotListener';

export const Scene = () => {
  return (
    <>
      <color attach="background" args={['#0a1128']} /> {/* Primary Navy to match theme */}
      <SnapshotListener />

      {/* Cinematic Lighting Strategy:
          1. Environment: Provides realistic base reflections and ambient fill.
          2. SpotLight: Key light for shadows and form.
          3. PointLight: Rim/Back light for separation.
      */}

      <Environment preset="studio" blur={0.8} environmentIntensity={0.3} />

      <ambientLight intensity={0.1} />
      <spotLight
        position={[4, 5, 4]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-bias={-0.0001}
      />
      <pointLight position={[-3, 2, -3]} intensity={1.0} color="#ffd1dc" /> {/* Warm rim light */}

      <group position={[0, -0.5, 0]}>
        <Cake />
        {/* Adjusted shadows for dark floor contrast */}
        <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#000000" />
      </group>

      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.1} radius={0.2} />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
        <ToneMapping />
      </EffectComposer>
    </>
  );
};
