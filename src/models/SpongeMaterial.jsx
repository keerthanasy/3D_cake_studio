import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const SpongeMaterial = ({ color }) => {
    // Since we don't have external assets, we'll use a procedural approach 
    // or a simple noise map if we had one. For now, we'll simulate porosity 
    // with high roughness and a normal map if available, or just standard material tweaks.

    // To make it look "spongey" without assets:
    // 1. High Roughness (no shiny reflections)
    // 2. Normal Map (if possible) -> We will simulate with noise in a real project
    // For this prototype, we'll use standard material adjustments

    return (
        <meshStandardMaterial
            color={color}
            roughness={0.8} // Very rough
            metalness={0.0}
            bumpScale={0.02}
            flatShading={false}
        />
    );
};
