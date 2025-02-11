import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Floor from "./Floor";
import Walls from "./Walls";
import Avatar from "../Avatar";

const OfficeFloor = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 20, 10], rotation: [-Math.PI / 4, 0, 0] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} />
        <Floor />
        <Walls />
        <Avatar />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default OfficeFloor;
