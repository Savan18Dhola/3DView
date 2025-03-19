'use client'
import dynamic from "next/dynamic";
const RestaurantScene = dynamic(() => import("@/components/RestaurantScene"), { ssr: false });

export default function Home() {
  return (
    <div style={{ height: "100vh", background: "#000" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>3D Floor Plan</h1>
      <RestaurantScene />
    </div>
  );
}
