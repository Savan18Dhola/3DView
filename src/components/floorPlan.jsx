"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@mui/material";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function FloorPlan() {
    const { scene } = useGLTF("/Demo_Stage.glb", true);
    const [hoveredTable, setHoveredTable] = useState(null);
    const [hoveredObject, setHoveredObject] = useState(null);
    const originalMaterials = useRef(new Map());
    const [isPlaneVisible, setIsPlaneVisible] = useState(false);

    const planeObject = useRef(null); // Store reference to Plane002

    // console.log("GLB Scene Data:", scene);
    // **Add price to each table when the scene loads**
    useEffect(() => {
        scene.traverse((object) => {
            if (object.name.trim().includes("Plane002")) {
                planeObject.current = object; // Store reference
                console.log("Added border lines with EdgesGeometry");
            }

            else if (object.name.trim().includes("_Low_Poly_Dining_Table")) {
                object.frustumCulled = false; // Ensure visibility in frustum
                object.raycast = THREE.Mesh.prototype.raycast; // Improve raycast detection

                if (!object.userData.price) {
                    object.userData.price = `$${Math.floor(Math.random() * 50) + 10}`; // Add price only once
                }
                if (!object.userData.capacity) {
                    object.userData.capacity = Math.floor(Math.random() * 6) + 2; // Random capacity between 2-8
                }
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

        // Create a new material based on the first image's green transparent style
        const newMaterial = new THREE.MeshBasicMaterial({  // Changed to MeshBasicMaterial
            transparent: true,
            opacity: 0.6,                // Higher opacity for more visibility
            color: new THREE.Color("#00ff6c"),  // Same green color
            depthWrite: false,           // Prevents z-fighting
            side: THREE.DoubleSide,      // Visible from both sides
        });

        planeObject.current.material = newMaterial;
    };


    const handlePointerOver = (e) => {
        e.stopPropagation();
        const object = e.object;
        if (hoveredObject === object) return;

        console.log('object', object)

        // Detect if the hovered object is the sheet
        if (object.name.trim().includes("Plane002")) {
            document.body.style.cursor = "pointer";
            setHoveredObject(object);

            if (!originalMaterials.current.has(object)) {
                originalMaterials.current.set(object, object.material.clone());
            }

            // Create a new MeshBasicMaterial for hover state
            const newMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.6,                // Match the opacity from updatePlaneMaterial
                color: new THREE.Color('#4e49e8'),  // Keep the purple hover color
                depthWrite: false,           // Prevents z-fighting
                side: THREE.DoubleSide       // Visible from both sides
            });

            object.material = newMaterial;
        }
        // Detect if the object is a dining table
        else if (object.name.trim().includes("_Low_Poly_Dining_Table")) {
            document.body.style.cursor = "pointer";
            setHoveredObject(object);
            if (!originalMaterials.current.has(object)) {
                originalMaterials.current.set(object, object.material.clone());
            }

            
            const newMaterial = object.material.clone();
            newMaterial.color.set('#4e49e8');
            newMaterial.emissive.set("#4e49e8"); // Slight glow effect
            newMaterial.roughness = 0.9; // Less reflective
            newMaterial.metalness = 0.1; // Less metallic
            object.material = newMaterial;

            setHoveredTable({
                name: object.name || "Table",
                price: object.userData.price || "N/A",
                capacity: object.userData.capacity || "N/A",
                position: e.intersections[0]?.point || object.position,
                object: object,
            });
        }
        else {
            resetAllMaterials()
        }
    };

    const handlePointerOut = (e) => {
        e.stopPropagation();
        const object = e.object;

        if (hoveredObject === object) return; // Prevent unnecessary updates

        resetAllMaterials()
    };

    const resetAllMaterials = () => {
        originalMaterials.current.forEach((material, object) => {
            object.material = material; // Restore original material
        });
        originalMaterials.current.clear();
        setHoveredObject(null);
        setHoveredTable(null);
        document.body.style.cursor = "default";
    };

    return (
        <group>
            <primitive
                object={scene}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                // onPointerMove={handlePointerMove}
                // rotation={[0, Math.PI * 1.5, 0]}
                raycast={THREE.Mesh.prototype.raycast}
            />
            {hoveredTable && (
                <Html position={[hoveredTable.position.x, hoveredTable.position.y + 0.5, hoveredTable.position.z]}>
                    <Tooltip open title={
                        <div>
                            <strong>{hoveredTable.name}</strong><br />
                            Price: {hoveredTable.price} <br />
                            Capacity: {hoveredTable.capacity} people
                        </div>
                    } placement="top">
                        <span style={{ width: 10, height: 10, display: "inline-block" }} />
                    </Tooltip>
                </Html>
            )}
        </group>
    );
}
