
'use client'
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import TableModel from "./tableModel";
import FloorPlan from "./floorPlan";

export default function RestaurantScene() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas shadows={false} camera={{ position: [0, 10, 15], fov: 80 }}>
        {/* Global Lighting */}
        <ambientLight intensity={0.7} />
        
        {/* Main directional light */}
        <directionalLight 
          castShadow 
          position={[5, 10, 5]} 
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Fill light from opposite side */}
        <directionalLight 
          position={[-5, 8, -5]} 
          intensity={0.6} 
          color="#ffffff"
        />
        
        {/* Add hemisphere light for more natural lighting */}
        {/* <hemisphereLight 
          skyColor={"#ffffff"} 
          groundColor={"#444444"} 
          intensity={0.4} 
        /> */}

        {/* Realistic Environment Lighting */}
        <Environment preset="city" />

        <OrbitControls maxDistance={30} />
        <FloorPlan/>
        {/* <TableModel /> */}
      </Canvas>
    </Suspense>
  );
}