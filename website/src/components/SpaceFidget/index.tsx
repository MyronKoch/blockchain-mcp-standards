import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Stars, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function NetworkSphere() {
    const meshRef = useRef<any>(null);
    const pointsRef = useRef<any>(null);

    // Generate particles that will stick to the sphere's rotation
    const particles = useMemo(() => {
        const count = 200;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.2 + Math.random() * 0.5; // Slightly outside the sphere radius (1)

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const mouseX = state.mouse.x;
            const mouseY = state.mouse.y;

            // Smoothly rotate based on mouse position
            const targetX = mouseY * 0.5;
            const targetY = mouseX * 0.5;

            meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
            meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.05;

            // Constant slow rotation
            meshRef.current.rotation.z += 0.001;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={meshRef} scale={2.8}>
                {/* The Wireframe Grid (Dyson Sphere Structure) */}
                <Icosahedron args={[1, 2]}>
                    <meshBasicMaterial color="#00ff9d" wireframe transparent opacity={0.3} />
                </Icosahedron>

                {/* Inner Core Glow */}
                <Icosahedron args={[0.9, 0]}>
                    <meshBasicMaterial color="#00ff9d" transparent opacity={0.05} />
                </Icosahedron>

                {/* Connected Nodes (Particles moving WITH the sphere) */}
                <Points positions={particles} stride={3} frustumCulled={false}>
                    <PointMaterial
                        transparent
                        color="#00f3ff"
                        size={0.03}
                        sizeAttenuation={true}
                        depthWrite={false}
                    />
                </Points>
            </group>
        </Float>
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
            opacity: 0.8,
            pointerEvents: 'auto', // ENABLED: Allows canvas to capture mouse position
        }}>
            <Canvas camera={{ position: [0, 0, 6] }}>
                <ambientLight intensity={0.5} />
                <NetworkSphere />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
