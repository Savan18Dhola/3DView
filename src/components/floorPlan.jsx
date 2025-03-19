"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@mui/material";

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

        console.log('object', object.name)
        console.log('object', object.name.trim().includes("_Low_Poly_Dining_Table"))
        if (object.name.trim().includes("_Low_Poly_Dining_Table")) {
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
                position: e.intersections[0].point,
                object: object,
            });
        }
    };

    console.log('hoveredTable', hoveredTable)

    const handlePointerOut = (e) => {
        e.stopPropagation();
        const object = e.object;

        if (hoveredObject !== object) return; // Prevent unnecessary updates
        setHoveredObject(null); // Reset hovered object
        document.body.style.cursor = "default";

        if (originalMaterials.current.has(object)) {
            object.material = originalMaterials.current.get(object);
            originalMaterials.current.delete(object);
        }

        setHoveredTable(null);
    };

    return (
        <group>
            <primitive
                object={scene}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            // rotation={[0, Math.PI * 1.5, 0]}
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
