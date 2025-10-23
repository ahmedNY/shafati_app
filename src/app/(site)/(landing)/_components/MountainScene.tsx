"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Component to load and display the 3D model
function Model() {
  // https://poly.pizza/m/1nhxC9-miLI
  const { scene } = useGLTF("/qasioun_mountain.gltf");
  return <primitive object={scene} scale={10} />; // Adjust scale as needed
}

export default function MountainScene() {
  return (
    <Canvas
      camera={{ position: [10, 8, 15], fov: 25 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={2} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls
        enableZoom={false} // Optional: disable zoom
        enablePan={false} // Optional: disable panning
        autoRotate // Optional: make it rotate automatically
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.2} // Prevent looking from below
        minPolarAngle={Math.PI / 3} // Prevent looking from top down
      />
    </Canvas>
  );
}
