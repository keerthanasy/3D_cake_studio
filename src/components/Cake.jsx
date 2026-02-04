import { useRef, useMemo } from 'react';
import { useCakeStore } from '../store/useCakeStore';
import { Text } from '@react-three/drei';
import { GenericTopping } from './Toppings';
import * as THREE from 'three';
import { getHeartShape, getStarShape, getMickeyShape, getDoraShape, getBujjiShape } from '../utils/shapes';
import { TOPPING_CATEGORIES } from '../utils/toppingConfig';
import { SpongeMaterial } from '../models/SpongeMaterial';


export const Cake = () => {
  const { shape, size, baseColor, text, textColor, toppings, layers } = useCakeStore((state) => state.cakeConfig);

  const scaleMap = { small: 0.8, medium: 1, large: 1.2 };
  const currentScale = scaleMap[size];

  // Default layers if not yet in store (backward compatibility)
  const cakeLayers = layers || [{ id: 1, color: baseColor, scale: 1 }];

  const { heartShape, starShape, mickeyShape, doraShape, bujjiShape } = useMemo(() => ({
    heartShape: getHeartShape(),
    starShape: getStarShape(),
    mickeyShape: getMickeyShape(),
    doraShape: getDoraShape(),
    bujjiShape: getBujjiShape()
  }), []);

  // Helper to find config for selected ID
  const getToppingConfig = (id) => {
    for (const cat of Object.values(TOPPING_CATEGORIES)) {
      const found = cat.find(t => t.id === id);
      if (found) return found;
    }
    return null;
  };

  const renderBaseGeometry = () => {
    switch (shape) {
      case 'square':
        return <boxGeometry args={[2.6, 1, 2.6]} />;
      case 'heart':
        return <extrudeGeometry args={[heartShape, { depth: 1, bevelEnabled: false, steps: 2 }]} />;
      case 'star':
        return <extrudeGeometry args={[starShape, { depth: 1, bevelEnabled: false, steps: 2 }]} />;
      case 'mickey':
        return <extrudeGeometry args={[mickeyShape, { depth: 1, bevelEnabled: false, steps: 2 }]} />;
      case 'dora':
        return <extrudeGeometry args={[doraShape, { depth: 1, bevelEnabled: false, steps: 2 }]} />;
      case 'bujji':
        return <extrudeGeometry args={[bujjiShape, { depth: 1, bevelEnabled: false, steps: 2 }]} />;
      case 'round':
      default:
        return <cylinderGeometry args={[1.5, 1.5, 1, 64]} />;
    }
  };

  // Base setup for rotation/offsets
  let baseRotation = [0, 0, 0];
  let baseOffset = [0, 0, 0];

  if (shape === 'heart' || shape === 'star' || shape === 'mickey' || shape === 'dora' || shape === 'bujji') {
    baseRotation = [-Math.PI / 2, 0, 0];
    if (shape === 'heart') baseOffset = [-0.5, 0, 1.0];
    // others are near 0 or need slight shift
    if (shape === 'mickey' || shape === 'dora' || shape === 'bujji') baseOffset = [0, 0, 0.5];
  }

  // Calculate total height for text/toppings placement
  let currentYStack = 0;

  return (
    <group scale={[currentScale, currentScale, currentScale]}>
      {/* Render Layers */}
      {cakeLayers.map((layer, index) => {
        // Calculate Y position for this layer
        // Base height is 1. Scaled by layer.height.
        const layerH = layer.height || 1;
        const yPos = currentYStack + (layerH / 2);

        // Update stack for NEXT layer
        currentYStack += layerH;

        return (
          <group
            key={layer.id || index}
            position={[0, yPos, 0]}
            rotation={baseRotation}
            scale={
              (shape === 'round' || shape === 'square')
                ? [layer.scale, layerH, layer.scale]
                : [layer.scale, layer.scale, layerH] // Extruded shape uses Z as height (rotated)
            }
          >
            {/** 
                  * Structure: Group handles Layer Transform (Stacking + Scaling).
                  * Mesh handles Geometry + Local Centering Offset.
                  */}
            <mesh position={baseOffset} receiveShadow castShadow>
              {renderBaseGeometry()}
              <SpongeMaterial color={layer.color} />
            </mesh>
            {/* Side Toppings for this Layer */}
            {toppings.map((toppingId) => {
              const config = getToppingConfig(toppingId);
              if (!config || config.type !== 'side') return null;
              return (
                <GenericTopping
                  key={toppingId}
                  config={config}
                  shape={shape}
                />
              );
            })}
          </group>
        );
      })}

      {/* Render Selected Toppings - Position on top of the last layer */}
      <group position={[0, currentYStack, 0]}>
        {/* Helper group to match top layer scale */}
        <group scale={[cakeLayers[cakeLayers.length - 1].scale, cakeLayers[cakeLayers.length - 1].scale, cakeLayers[cakeLayers.length - 1].scale]}>
          {toppings.map((toppingId) => {
            const config = getToppingConfig(toppingId);
            if (!config || config.type === 'side') return null; // Skip side toppings here

            return (
              <GenericTopping
                key={toppingId}
                config={config}
                shape={shape}
              />
            );
          })}
        </group>
      </group>

      {/* Text Decoration - Simple projection on top for now */}
      {text && (
        <Text
          position={[0, currentYStack + 0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3 * cakeLayers[cakeLayers.length - 1].scale} // Scale text with top layer
          color={textColor}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      )}
    </group>
  );
};
