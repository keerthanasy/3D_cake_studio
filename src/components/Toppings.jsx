import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF, Clone } from '@react-three/drei';

// Preload common 3D assets to reduce lag on interaction
// We iterate through the config to dynamicially preload everything
const ALL_MODELS = [
    '/models/cherries.glb',
    '/models/strawberry.glb',
    '/models/kiwi.glb',
    '/models/pineapple.glb',
    '/models/choco_chips.glb',
    '/models/fudge_cubes.glb',
    '/models/kitkat.glb',
    '/models/oreo.glb',
    '/models/almonds.glb',
    '/models/cashews.glb',
    '/models/macarons.glb',
    '/models/ferrero.glb'
];

ALL_MODELS.forEach(path => useGLTF.preload(path));
import { getHeartShape, getStarShape, getMickeyShape, getDoraShape, getBujjiShape } from '../utils/shapes';
import { TOPPING_CATEGORIES } from '../utils/toppingConfig';

// --- Utility: Random Point in Shape (Rejection Sampling) ---
const getRandomPointInShape = (shapeObj, bbox) => {
    let pt = new THREE.Vector2();
    for (let i = 0; i < 50; i++) {
        pt.x = bbox.minX + Math.random() * (bbox.maxX - bbox.minX);
        pt.y = bbox.minY + Math.random() * (bbox.maxY - bbox.minY);
        // Simple bounding checks might suffice if isPointInside is heavy
        // But for quality distribution:
        const points = shapeObj.getPoints ? shapeObj.getPoints() : [];
        if (points.length > 0 && isPointInside(pt, points)) {
            return pt;
        }
    }
    return pt;
};

const isPointInside = (pt, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = ((yi > pt.y) !== (yj > pt.y))
            && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

// --- Helper: Get Shapes Cache ---
const useShapeCache = () => {
    return useMemo(() => ({
        heart: getHeartShape(),
        star: getStarShape(),
        mickey: getMickeyShape(),
        dora: getDoraShape(),
        bujji: getBujjiShape()
    }), []);
};

// --- Helper: 2D to 3D Transform based on Cake Shape ---
const mapTo3D = (x, y, shape) => {
    const TOP_Y = 0.0;
    // All cakes have top surface at roughly Y=1.0 in World Space.

    // Default: Round/Square (Y-up flat)
    if (shape === 'round' || shape === 'square') {
        return [x, TOP_Y, y]; // Relative to group center
    }
    // Extruded Shapes (Heart, Star, Mickey, Dora, Bujji)
    // Mesh is RotX(-90). Top face is Z=1 (Local) -> Y=1 (World).
    // Logic for X/Z mapping based on Mesh Position offsets:
    else {
        // Heart: Pos [-0.5, 0, 1.0] -> Z_world offset = 1.0. Rot -90X means local Y becomes -Z_world? 
        // Let's re-verify:
        // Local P(x,y,z). RotX(-90) -> P'(x, z, -y).
        // MeshPos M. World = P' + M.
        // World = (x + Mx, z + My, -y + Mz).
        // We want Topping on Top Face (z=1).
        // World Y = 1 + My = 1 + 0 = 1. (Correct)
        // World X = x + Mx.
        // World Z = -y + Mz.

        if (shape === 'heart') return [x - 0.5, TOP_Y, 1.0 - y];
        if (shape === 'mickey' || shape === 'dora' || shape === 'bujji') return [x, TOP_Y, 0.5 - y];
        if (shape === 'star') return [x, TOP_Y, -y];
    }
    return [x, TOP_Y, y];
};


const ModelTopping = ({ modelPath, instances, baseScale, rotationOffset = [0, 0, 0] }) => {
    const { scene } = useGLTF(modelPath);
    return (
        <group>
            {instances.map((obj, i) => (
                <Clone
                    key={i}
                    object={scene}
                    position={obj.pos}
                    rotation={[
                        rotationOffset[0],
                        obj.rot + rotationOffset[1],
                        rotationOffset[2]
                    ]}
                    scale={baseScale * obj.scale}
                    castShadow
                />
            ))}
        </group>
    );
};

// ... (existing imports)
import { ChocolateMaterial, FruitMaterial, CreamMaterial, CandleWaxMaterial } from '../models/DeliciousMaterials';
import { SpongeMaterial } from '../models/SpongeMaterial';

// ... (existing helpers)

// Helper to guess material from ID if not explicit
const getMaterialForTopping = (id, color) => {
    if (id.includes('chocolate') || id.includes('choco') || id.includes('fudge') || id.includes('ferrero')) {
        return <ChocolateMaterial color={color === 'multi' ? '#5d4037' : color} />;
    }
    if (id.includes('berry') || id.includes('cherry') || id.includes('fruit') || id.includes('kiwi') || id.includes('pineapple')) {
        return <FruitMaterial color={color} />;
    }
    if (id.includes('cream') || id.includes('rose') || id.includes('macaron')) {
        return <CreamMaterial color={color} />;
    }
    if (id.includes('candle')) {
        return <CandleWaxMaterial color={color} />;
    }
    if (id.includes('nut') || id.includes('almond') || id.includes('cashew')) {
        return <SpongeMaterial color={color} />; // Matte texture for nuts
    }
    // Default fallback (Sprinkles etc)
    return <FruitMaterial color={color === 'multi' ? '#ff0000' : color} />; // Glossy default
};

// --- Generic Topping Component ---
export const GenericTopping = ({ config, count = 20, shape = 'round' }) => {
    const { id, type, color, shape: geomShape, scale, model, rotation } = config;
    const shapes = useShapeCache();

    // ... (existing instance logic)
    const instances = useMemo(() => {
        // 1. Determine Points
        let points = [];

        // Bounding Boxes
        let bbox = { minX: -1.5, maxX: 1.5, minY: -1.5, maxY: 1.5 };
        if (shape === 'heart') bbox = { minX: -0.6, maxX: 1.6, minY: 0, maxY: 2 };
        if (shape === 'mickey') bbox = { minX: -2, maxX: 2, minY: -1.5, maxY: 2.5 };

        // Distribution Strategy
        if (type === 'scatter') {
            // Random Scatter logic
            const scatterCount = config.count || (id.includes('sprinkles') ? 150 : 30);
            for (let i = 0; i < scatterCount; i++) {
                if (shape === 'round') {
                    const r = (id.includes('sprinkles') ? 1.4 : 1.2) * Math.sqrt(Math.random());
                    const th = Math.random() * 2 * Math.PI;
                    points.push({ x: r * Math.cos(th), y: r * Math.sin(th), r: Math.random() });
                } else if (shape === 'square') {
                    const s = 2.4;
                    points.push({ x: (Math.random() - 0.5) * s, y: (Math.random() - 0.5) * s, r: Math.random() });
                } else {
                    const pt = getRandomPointInShape(shapes[shape], bbox);
                    points.push({ x: pt.x, y: pt.y, r: Math.random() });
                }
            }
        }
        else if (type === 'perimeter') {
            // Edge/Ring logic
            const pCount = 12; // Fewer items
            if (shape === 'round') {
                const radius = config.radius || 1.2;
                for (let i = 0; i < pCount; i++) {
                    const th = (i / pCount) * Math.PI * 2;
                    points.push({ x: radius * Math.cos(th), y: radius * Math.sin(th), rot: -th });
                }
            } else if (shape === 'square') {
                // Perimeter walk
                for (let i = 0; i < pCount; i++) {
                    const p = (i / pCount) * 4;
                    let px = 0, py = 0;
                    const h = 1.1;
                    if (p < 1) { px = -h + p * 2 * h; py = -h; }
                    else if (p < 2) { px = h; py = -h + (p - 1) * 2 * h; }
                    else if (p < 3) { px = h - (p - 2) * 2 * h; py = h; }
                    else { px = -h; py = h - (p - 3) * 2 * h; }
                    points.push({ x: px, y: py, rot: 0 });
                }
            } else {
                const shp = shapes[shape];
                if (shp) {
                    for (let i = 0; i < pCount; i++) {
                        const pt = shp.getPointAt(i / pCount);
                        points.push({ x: pt.x, y: pt.y, rot: 0 });
                    }
                }
            }
        }
        else if (type === 'center') {
            // Just one or few in middle
            if (shape === 'round' || shape === 'square') {
                points.push({ x: 0, y: 0, rot: 0 });
            } else if (shape === 'heart') {
                points.push({ x: 0.5, y: 0.8, rot: 0 }); // Visual center approx
            } else if (shape === 'star') {
                points.push({ x: 0, y: 0, rot: 0 });
            } else { // mickey/dora/bujji
                points.push({ x: 0, y: 0, rot: 0 });
            }
        }
        else if (type === 'side') {
            const sideCount = config.count || 20;
            if (shape === 'round') {
                const radius = config.radius || 1.55; // Sit flush against radius 1.5
                for (let i = 0; i < sideCount; i++) {
                    const th = (i / sideCount) * Math.PI * 2;
                    // rot: -th makes it tangent logic (if model Z aligned)
                    points.push({ x: radius * Math.cos(th), y: radius * Math.sin(th), rot: -th });
                }
            } else if (shape === 'square') {
                for (let i = 0; i < sideCount; i++) {
                    const p = (i / sideCount) * 4;
                    let px = 0, py = 0, rot = 0;
                    const h = 1.35; // Cake half-width 1.3 + offset
                    if (p < 1) { px = -h + p * 2 * h; py = -h; rot = 0; }
                    else if (p < 2) { px = h; py = -h + (p - 1) * 2 * h; rot = -Math.PI / 2; }
                    else if (p < 3) { px = h - (p - 2) * 2 * h; py = h; rot = -Math.PI; }
                    else { px = -h; py = h - (p - 3) * 2 * h; rot = -Math.PI * 1.5; }
                    points.push({ x: px, y: py, rot });
                }
            } else {
                // Fallback to perimeter logic or shape based
                const shp = shapes[shape];
                if (shp) {
                    for (let i = 0; i < sideCount; i++) {
                        const pt = shp.getPointAt(i / sideCount);
                        // Approximate tangent?
                        const ptNext = shp.getPointAt(((i + 1) % sideCount) / sideCount);
                        const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);
                        points.push({ x: pt.x, y: pt.y, rot: -angle });
                    }
                }
            }
        }
        else if (type === 'surface') { // Full top coverage
            if (shape === 'round') {
                // Concentric circles
                points.push({ x: 0, y: 0, rot: 0 }); // Center
                const maxRadius = 1.35;
                const itemRadius = 0.25; // Approx oreo radius
                const spacing = itemRadius * 2.2;

                let currentR = spacing;
                while (currentR < maxRadius) {
                    const circumference = 2 * Math.PI * currentR;
                    const countInRing = Math.floor(circumference / spacing);
                    for (let i = 0; i < countInRing; i++) {
                        const th = (i / countInRing) * Math.PI * 2;
                        // Add some random rot for variation or keep 0
                        points.push({
                            x: currentR * Math.cos(th),
                            y: currentR * Math.sin(th),
                            rot: Math.random() * Math.PI
                        });
                    }
                    currentR += spacing;
                }
            } else if (shape === 'square') {
                // Grid fill
                const size = 2.4;
                const step = 0.5;
                for (let x = -size / 2; x <= size / 2; x += step) {
                    for (let y = -size / 2; y <= size / 2; y += step) {
                        points.push({ x, y, rot: Math.random() * Math.PI });
                    }
                }
            } else {
                // Fallback to random scatter with high density
                const scatterCount = 80;
                const shp = shapes[shape];
                for (let i = 0; i < scatterCount; i++) {
                    const pt = getRandomPointInShape(shp, bbox);
                    points.push({ x: pt.x, y: pt.y, r: Math.random() });
                }
            }
        }

        // 2. Map to 3D Transforms
        return points.map(p => {
            const finalPos = mapTo3D(p.x, p.y, shape);
            // Height offset
            const defaultBaseHeight = (type === 'scatter' ? 0.02 : 0.1);
            finalPos[1] += defaultBaseHeight + (config.yOffset || 0);
            return { pos: finalPos, rot: p.rot || 0, scale: p.r || 1 };
        });

    }, [id, type, shape, shapes]);

    if (model) {
        return <ModelTopping
            modelPath={model}
            instances={instances}
            baseScale={scale}
            rotationOffset={rotation}
        />;
    }

    // --- PROCEDURAL CANDLE LOGIC ---
    if (id === 'candles') {
        const candleHeight = 0.6;
        const candleRadius = scale;
        return (
            <group>
                {instances.map((obj, i) => (
                    <group key={i} position={[obj.pos[0], obj.pos[1] + candleHeight / 2, obj.pos[2]]} rotation={[0, obj.rot, 0]}>
                        {/* Wax Body */}
                        <mesh castShadow receiveShadow>
                            <cylinderGeometry args={[candleRadius, candleRadius, candleHeight, 16]} />
                            <CandleWaxMaterial color={color} />
                        </mesh>
                        {/* Wick */}
                        <mesh position={[0, candleHeight / 2 + 0.05, 0]}>
                            <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                            <meshStandardMaterial color="#333" />
                        </mesh>
                        {/* Flame */}
                        <mesh position={[0, candleHeight / 2 + 0.15, 0]}>
                            <coneGeometry args={[0.04, 0.15, 8]} />
                            <meshStandardMaterial color="#ff9f43" emissive="#ff6b6b" emissiveIntensity={3} toneMapped={false} />
                        </mesh>
                        {/* Flame Glow (Simple point light) */}
                        <pointLight position={[0, candleHeight / 2 + 0.2, 0]} intensity={0.5} color="#ff9f43" distance={1} decay={2} />
                    </group>
                ))}
            </group>
        );
    }

    // Geometry Selection
    let Geometery = <sphereGeometry args={[scale, 16, 16]} />;
    if (geomShape === 'cone') Geometery = <coneGeometry args={[scale, scale * 2, 16]} />;
    if (geomShape === 'box') Geometery = <boxGeometry args={[scale, scale, scale]} />;
    if (geomShape === 'cylinder') Geometery = <cylinderGeometry args={[scale, scale, scale / 2, 16]} />;
    if (geomShape === 'capsule') Geometery = <capsuleGeometry args={[scale / 2, scale * 2, 4, 8]} />;
    if (geomShape === 'torus') Geometery = <torusGeometry args={[scale, scale / 3, 8, 16]} />;
    if (geomShape === 'rose') Geometery = <torusKnotGeometry args={[scale / 2, scale / 6, 64, 8]} />; // Simulated rose

    // Determine Material
    const MaterialComponent = getMaterialForTopping(id, color);
    const isMultiColor = color === 'multi';

    return (
        <group>
            {instances.map((obj, i) => (
                <mesh key={i} position={obj.pos} rotation={[0, obj.rot, 0]} castShadow>
                    {Geometery}
                    {/* If multicolor, we need to clone the element or just pass color override? 
                         Our materials take a color prop. 
                         For multicolor we might need to inline the material or use logic.
                     */}
                    {isMultiColor ? (
                        <FruitMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
                    ) : (
                        MaterialComponent
                    )}
                </mesh>
            ))}
        </group>
    );
};
