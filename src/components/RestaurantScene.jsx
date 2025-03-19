
'use client'
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import TableModel from "./tableModel";
import FloorPlan from "./floorPlan";

export default function RestaurantScene() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas shadows camera={{ position: [0, 10, 15], fov: 80 }}>
        {/* Global Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[3,5,2]} intensity={1} />
        {/* <hemisphereLight skyColor={"#ffffff"} groundColor={"#444444"} intensity={0.6} /> */}

        {/* Realistic Environment Lighting */}
        <Environment preset="city" />

        <OrbitControls maxDistance={30} />
        <FloorPlan/>
        {/* <TableModel /> */}
      </Canvas>
    </Suspense>
  );
}