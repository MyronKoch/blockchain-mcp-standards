import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

function AnimatedSphere() {
    const sphereRef = useRef<any>(null);

    useFrame((state) => {
        if (sphereRef.current) {
            // Get mouse position (normalized -1 to 1)
            const mouseX = state.mouse.x;
            const mouseY = state.mouse.y;

            // Target rotation based on mouse position
            // Multiply by a factor to control sensitivity
            const targetX = mouseY * 0.5;
            const targetY = mouseX * 0.5;

            // Smoothly interpolate current rotation to target (lerp)
            // This creates the "dragging" feel with some weight
            sphereRef.current.rotation.x += (targetX - sphereRef.current.rotation.x) * 0.1;
            sphereRef.current.rotation.y += (targetY - sphereRef.current.rotation.y) * 0.1;

            // Add a subtle constant rotation so it's never fully static
            sphereRef.current.rotation.z += 0.002;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
            <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.5}>
                <MeshDistortMaterial
                    color="#00ff9d"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={true}
                />
            </Sphere>
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
            opacity: 0.6,
            pointerEvents: 'none', // Pass through clicks to buttons below, since we don't need drag anymore
        }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ff9d" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
                <AnimatedSphere />
            </Canvas>
        </div>
    );
}
