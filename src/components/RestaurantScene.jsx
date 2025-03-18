
'use client'
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TableModel from "./tableModel";

export default function RestaurantScene() {
  return (
     <Suspense fallback={<div>Loading...</div>}>
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}> 
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <OrbitControls 
          // minDistance={10}  // Ensures no extreme zoom-in
          maxDistance={30}  // Allows zooming out for full view
        />
        <TableModel />
      </Canvas>
    </Suspense>
  );
}