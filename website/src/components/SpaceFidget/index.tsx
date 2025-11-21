import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float, Stars, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function NetworkSphere() {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const mouseX = state.mouse.x;
            const mouseY = state.mouse.y;

            const targetX = mouseY * 0.8;
            const targetY = mouseX * 0.8;

            meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
            meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.05;
            meshRef.current.rotation.z += 0.001;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <Icosahedron ref={meshRef} args={[1, 4]} scale={2.8}>
                <MeshDistortMaterial
                    color="#00ff9d"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0}
                    metalness={0.9}
                    wireframe={true}
                />
            </Icosahedron>
        </Float>
    );
}

function NodeParticles() {
    const ref = useRef<any>(null);

    // Generate random positions for particles on a sphere surface
    const positions = useMemo(() => {
        const pos = new Float32Array(300 * 3);
        for (let i = 0; i < 300; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Random point on sphere surface + some noise
            const r = 3.5 + Math.random() * 1.5;
            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y -= 0.001;
            ref.current.rotation.x += 0.0005;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function SpaceFidget() {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.5,
            pointerEvents: 'none',
        }}>
            <Canvas camera={{ position: [0, 0, 6] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ff9d" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />

                <NetworkSphere />
                <NodeParticles />
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
