"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { useFrame } from "@react-three/fiber"; // Import useFrame for view detection
import * as THREE from "three";

export default function FloorPlan() {
    const { scene } = useGLTF("/Demo_Stage.glb", true);
    const [hoveredTable, setHoveredTable] = useState(null);
    const [hoveredObject, setHoveredObject] = useState(null);
    const [isPlaneVisible, setIsPlaneVisible] = useState(false); // Track if Plane002 is visible
    const originalMaterials = useRef(new Map());
    const planeObject = useRef(null); // Store reference to Plane002

    useEffect(() => {
        scene.traverse((object) => {
            if (object.name.trim().includes("Plane002")) {
                planeObject.current = object; // Store reference
            }
        });
    }, [scene]);

    useFrame(({ camera }) => {
        if (planeObject.current) {
            const frustum = new THREE.Frustum();
            const cameraViewProjectionMatrix = new THREE.Matrix4();
            camera.updateMatrixWorld(); 
            camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
            camera.projectionMatrix.copy(camera.projectionMatrix);
            cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

            const isVisible = frustum.intersectsObject(planeObject.current);
            if (isVisible !== isPlaneVisible) {
                setIsPlaneVisible(isVisible);
                updatePlaneMaterial(isVisible);
            }
        }
    });

    const updatePlaneMaterial = (isVisible) => {
        if (!planeObject.current) return;

        const newMaterial = planeObject.current.material.clone();
        newMaterial.transparent = true;
        newMaterial.opacity = isVisible ? 0.6 : 0.3; // More visible when in view
        newMaterial.color.set(isVisible ? "#00ff6c" : "#ff0000"); // Green when in view, red when not
        newMaterial.emissive.set(isVisible ? "#00ff6c" : "#ff0000");
        newMaterial.roughness = 0.8;
        newMaterial.metalness = 0.2;
        planeObject.current.material = newMaterial;
    };

    return (
        <group>
            <primitive object={scene} />
        </group>
    );
}
