import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCakeStore } from '../store/useCakeStore';
import * as THREE from 'three';
import { getHeartShape, getStarShape, getMickeyShape, getDoraShape, getBujjiShape } from '../utils/shapes';
import { chocolateStreamVertexShader, chocolateStreamFragmentShader, chocolateGlazeFragmentShader } from '../shaders/ChocolateShaders';

// Reuse geometry logic from Cake.jsx
const GlazeGeometry = ({ shape, heartShape, starShape, mickeyShape, doraShape, bujjiShape }) => {
    switch (shape) {
        case 'square':
            return <boxGeometry args={[2.65, 1.02, 2.65]} />; // Slightly larger
        case 'heart':
            return <extrudeGeometry args={[heartShape, { depth: 1.02, bevelEnabled: false, steps: 2 }]} />;
        case 'star':
            return <extrudeGeometry args={[starShape, { depth: 1.02, bevelEnabled: false, steps: 2 }]} />;
        case 'mickey':
            return <extrudeGeometry args={[mickeyShape, { depth: 1.02, bevelEnabled: false, steps: 2 }]} />;
        case 'dora':
            return <extrudeGeometry args={[doraShape, { depth: 1.02, bevelEnabled: false, steps: 2 }]} />;
        case 'bujji':
            return <extrudeGeometry args={[bujjiShape, { depth: 1.02, bevelEnabled: false, steps: 2 }]} />;
        case 'round':
        default:
            return <cylinderGeometry args={[1.52, 1.52, 1.02, 64]} />;
    }
};

// --- Glass Container Component ---
const GlassContainer = ({ isPouring, updateSpoutPos }) => {
    const groupRef = useRef();
    const liquidRef = useRef();
    const [targetRot, setTargetRot] = useState(0);

    // Initial position: Off to the side/top
    const startPos = new THREE.Vector3(2.5, 4.5, 0);
    const pourPos = new THREE.Vector3(0.0, 5.0, 0);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Animate Position & Rotation
        if (isPouring) {
            // Move to pour position
            groupRef.current.position.lerp(pourPos, delta * 2);
            // Rotate to pour (Z axis)
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.PI / 3, delta * 2); // 60 degrees

            // Animate Liquid Level inside (Fake scale down)
            if (liquidRef.current) {
                liquidRef.current.scale.y = THREE.MathUtils.lerp(liquidRef.current.scale.y, 0.2, delta * 0.5);
            }
        } else {
            // Return to start
            groupRef.current.position.lerp(startPos, delta * 2);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 2);

            // Refill liquid when back
            if (liquidRef.current && groupRef.current.position.distanceTo(startPos) < 0.1) {
                liquidRef.current.scale.y = THREE.MathUtils.lerp(liquidRef.current.scale.y, 1, delta * 5);
            }
        }

        // Calculate world position of the "spout" for the stream
        // Spout is at local (0, 1.1, 0) relative to the glass center
        if (updateSpoutPos) {
            const spoutLocal = new THREE.Vector3(0, 1.1, 0); // Top of glass
            spoutLocal.applyMatrix4(groupRef.current.matrixWorld);
            updateSpoutPos(spoutLocal);
        }
    });

    return (
        <group ref={groupRef} position={[2.5, 4.5, 0]}>
            {/* Glass Shell */}
            <mesh renderOrder={2}>
                {/* Simple cup shape using Lathe */}
                <cylinderGeometry args={[0.6, 0.5, 2.2, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    opacity={0.3}
                    transparent
                    roughness={0.1}
                    thickness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={[0, -1.1, 0]} renderOrder={2}>
                <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    opacity={0.3}
                    transparent
                    roughness={0.1}
                />
            </mesh>

            {/* Liquid Inside */}
            <mesh ref={liquidRef} position={[0, -0.1, 0]} scale={[0.9, 0.9, 0.9]}>
                <cylinderGeometry args={[0.55, 0.45, 2.0, 32]} />
                <meshStandardMaterial color="#3e2723" roughness={0.3} />
            </mesh>
        </group>
    );
};

// --- Updated Stream ---
const Stream = ({ isPouring, spoutPos }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const [active, setActive] = useState(false);

    // Shift geometry so origin is at the top for correct scaling
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.geometry.center(); // Center first to be safe
            meshRef.current.geometry.translate(0, -3, 0); // Shift down by half height (6/2)
        }
    }, []);

    useEffect(() => {
        if (isPouring) {
            setActive(true);
            // Reset scale if starting fresh
            if (meshRef.current) {
                meshRef.current.scale.set(0, 0, 0);
                meshRef.current.visible = true;
            }
        }
    }, [isPouring]);

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }

        if (meshRef.current && spoutPos) {
            // Position stream EXACTLY at spout (Origin is now Top)
            meshRef.current.position.copy(spoutPos);
        }

        if (isPouring) {
            // 1. Gravity: Stream lengthens downwards (Scale Y)
            // Fast acceleration
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, delta * 10);

            // 2. Volume: Stream thickens (Scale X/Z)
            // Starts thin (liquid string) then widens
            const currentY = meshRef.current.scale.y;
            const targetThickness = 1;

            // Only thicken once it has some length
            if (currentY > 0.1) {
                meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetThickness, delta * 5);
                meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetThickness, delta * 5);
            } else {
                // Start distinctively thin
                meshRef.current.scale.x = 0.2;
                meshRef.current.scale.z = 0.2;
            }

            meshRef.current.visible = true;
        } else {
            // Retract/Thin out
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0, delta * 10); // Shrink up
            meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 0, delta * 15); // Thin out
            meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 0, delta * 15);

            if (meshRef.current.scale.y < 0.01) meshRef.current.visible = false;
        }
    });

    return (
        <mesh ref={meshRef} visible={false}>
            {/* Thinner stream with high segment count for smooth shader deformation */}
            <cylinderGeometry args={[0.06, 0.06, 6, 32, 60]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={chocolateStreamVertexShader}
                fragmentShader={chocolateStreamFragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color('#3e2723') },
                    uViscosity: { value: 0.8 } // Tweaked viscosity
                }}
                transparent
            />
        </mesh>
    );
};

export const ChocolateManager = () => {
    const { shape, layers } = useCakeStore((state) => state.cakeConfig);
    const { isPouring, glazeLevel, setGlazeLevel, stopPour } = useCakeStore();
    const [spoutPos, setSpoutPos] = useState(new THREE.Vector3(0, 5, 0));

    // Shape memoization
    const { heartShape, starShape, mickeyShape, doraShape, bujjiShape } = useMemo(() => ({
        heartShape: getHeartShape(),
        starShape: getStarShape(),
        mickeyShape: getMickeyShape(),
        doraShape: getDoraShape(),
        bujjiShape: getBujjiShape()
    }), []);

    // Animation Logic
    useFrame((state, delta) => {
        if (isPouring) {
            // Slow down glaze fill to match new animation
            const nextLevel = glazeLevel + delta * 0.2;
            if (nextLevel >= 1.2) {
                setGlazeLevel(1);
                stopPour();
            } else {
                setGlazeLevel(nextLevel);
            }
        }
    });

    // Glaze Material
    const glazeMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: chocolateGlazeFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#3e2723') },
                uProgress: { value: 0 }
            },
            transparent: true,
            side: THREE.DoubleSide
        });
    }, []);

    // Update uniforms
    useFrame((state, delta) => {
        glazeMaterial.uniforms.uTime.value += delta;
        glazeMaterial.uniforms.uProgress.value = glazeLevel;
    });

    // Cake Shape Transforms
    let baseRotation = [0, 0, 0];
    let baseOffset = [0, 0, 0];
    if (shape === 'heart' || shape === 'star' || shape === 'mickey' || shape === 'dora' || shape === 'bujji') {
        baseRotation = [-Math.PI / 2, 0, 0];
        if (shape === 'heart') baseOffset = [-0.5, 0, 1.0];
        if (shape === 'mickey' || shape === 'dora' || shape === 'bujji') baseOffset = [0, 0, 0.5];
    }

    let currentYStack = 0;

    return (
        <group>
            {/* Glass Container */}
            <GlassContainer isPouring={isPouring} updateSpoutPos={setSpoutPos} />

            {/* Stream */}
            <Stream isPouring={isPouring} spoutPos={spoutPos} />

            {/* Glaze Layers */}
            <group visible={isPouring || glazeLevel > 0}>
                {/* Only render glaze on the TOP layer to act as the primary impact/spread surface */}
                {layers.length > 0 && (() => {
                    const index = layers.length - 1;
                    const layer = layers[index];

                    // Helper: Recalculate YStack for just the top layer
                    // (We can't rely on the mutable currentYStack from previous loop if we jump straight here)
                    let stackHeight = 0;
                    for (let i = 0; i < index; i++) stackHeight += (layers[i].height || 1);

                    const layerH = layer.height || 1;
                    const yPos = stackHeight + (layerH / 2);
                    const scale = layer.scale * 1.02;

                    return (
                        <group
                            key={`glaze-${index}`}
                            position={[0, yPos, 0]}
                            rotation={baseRotation}
                            scale={(shape === 'round' || shape === 'square') ? [scale, layerH, scale] : [scale, scale, layerH]}
                        >
                            <mesh position={baseOffset}>
                                <GlazeGeometry
                                    shape={shape}
                                    heartShape={heartShape}
                                    starShape={starShape}
                                    mickeyShape={mickeyShape}
                                    doraShape={doraShape}
                                    bujjiShape={bujjiShape}
                                />
                                <primitive object={glazeMaterial} attach="material" />
                            </mesh>
                        </group>
                    );
                })()}
            </group>
        </group>
    );
};
