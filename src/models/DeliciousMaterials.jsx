import * as THREE from 'three';

export const ChocolateMaterial = ({ color = "#3e2723" }) => (
    <meshPhysicalMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        clearcoat={0.3}       // Slight sheen
        clearcoatRoughness={0.4}
    />
);

export const FruitMaterial = ({ color = "#d63031" }) => (
    <meshPhysicalMaterial
        color={color}
        roughness={0.15}      // Shiny
        metalness={0.0}
        transmission={0.2}    // Slight Jelly look
        thickness={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
    />
);

export const CreamMaterial = ({ color = "#ffffff" }) => (
    <meshStandardMaterial
        color={color}
        roughness={0.9} // Matte
        metalness={0.0}
    />
);

export const CandleWaxMaterial = ({ color }) => (
    <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
    />
);
