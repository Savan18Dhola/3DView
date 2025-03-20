"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@mui/material";
import * as THREE from "three";

export default function FloorPlan() {
    const { scene } = useGLTF("/Demo_Stage.glb", true);
    const [hoveredTable, setHoveredTable] = useState(null);
    const [hoveredObject, setHoveredObject] = useState(null);
    const originalMaterials = useRef(new Map());

    // console.log("GLB Scene Data:", scene);
    // **Add price to each table when the scene loads**
    useEffect(() => {
        scene.traverse((object) => {
            if (object.name.trim().includes("_Low_Poly_Dining_Table")) {
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


    const handlePointerOver = (e) => {
        e.stopPropagation();
        const object = e.object;
        if (hoveredObject === object) return;

        console.log('object',object.name)

        // Detect if the hovered object is the sheet
        if (object.name.trim().includes("Plane002")) {
            document.body.style.cursor = "pointer";
            setHoveredObject(object);

            if (!originalMaterials.current.has(object)) {
                originalMaterials.current.set(object, object.material.clone());
            }

            const newMaterial = object.material.clone();
            newMaterial.transparent = true;
            newMaterial.color.set('blue');
            newMaterial.opacity = 0.5;  // Make it semi-transparent
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
            newMaterial.color.set('blue');
            newMaterial.emissive.set("#300000"); // Slight glow effect
            newMaterial.roughness = 0.8; // Less reflective
            newMaterial.metalness = 0.2; // Less metallic
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
