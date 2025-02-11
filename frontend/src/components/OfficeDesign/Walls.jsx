import React from "react";

const Wall = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
    <boxGeometry args={[50, 5, 0.5]} />
    <meshStandardMaterial color="white" />
  </mesh>

  );
};
const Walls = () => {
  return (
    <>
       {/* Back Wall */}
    <Wall position={[0, 2.5, -25]} />
    {/* Front Wall */}
    <Wall position={[0, 2.5, 25]} />
    {/* Left Wall */}
    <Wall position={[-25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
    {/* Right Wall */}
    <Wall position={[25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />

    </>
  );
};

export default Walls;
