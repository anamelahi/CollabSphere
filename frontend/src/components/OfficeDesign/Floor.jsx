import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Floor = () => {
    const texture = useLoader(THREE.TextureLoader, "/textures/floor.jpg");
    return (
    <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
    {/* <OrbitControls /> */}
    </>
    

  );

};

export default Floor;
