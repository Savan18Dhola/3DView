"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef } from "react";
import { Tooltip } from "@mui/material";

export default function TableModel() {
    const { scene } = useGLTF("/beach_restaurant.glb", true);
    const [hoveredTable, setHoveredTable] = useState(null);
    const originalMaterials = useRef(new Map()); 

    console.log("GLB Scene Data:", scene);


    const handlePointerOver = (e) => {
        e.stopPropagation();
        const object = e.object;

        console.log('object', object.name, object.parent.name)
        if (object.parent && object.parent.name.trim().toLowerCase().includes("pcylinder")) {

            if (!originalMaterials.current.has(object)) {
                originalMaterials.current.set(object, object.material.clone()); 
            }

            const newMaterial = object.material.clone();
            newMaterial.color.set("red");
            object.material = newMaterial;

            setHoveredTable({
                name: object.name || "Table",
                price: `$${Math.floor(Math.random() * 50) + 10}`,
                position: e.intersections[0].point,
                object: object,
            });
        }
    };

    const handlePointerOut = (e) => {
        e.stopPropagation();
        const object = e.object;

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
                rotation={[0, Math.PI * 1.5, 0]}
            />

            {hoveredTable && (
                <Html position={[hoveredTable.position.x, hoveredTable.position.y + 0.5, hoveredTable.position.z]}>
                    <Tooltip open title={<div><strong>{hoveredTable.name}</strong><br />Price: {hoveredTable.price}</div>} placement="top">
                        <span style={{ width: 10, height: 10, display: "inline-block" }} />
                    </Tooltip>
                </Html>
            )}
        </group>
    );
}
