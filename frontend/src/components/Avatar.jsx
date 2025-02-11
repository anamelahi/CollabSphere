import React ,{useState,useEffect, useRef} from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Avatar = () => {
    const avatarRef = useRef();
    //initial position of the avatar
    const [position,setPosition] = useState([0,0,0]);
    // const [rotation,setRotation] = useState([0,0,0]);
    // const [scale,setScale] = useState([1,1,1]);
    // const [visible,setVisible] = useState(true);
    // const [name,setName] = useState("Player");
    // const [color,setColor] = useState("blue");
    const handleMovement =(e)=>{
        setPosition((prev)=>{
            switch (e.key) {
                case "ArrowUp":
                    return [prev[0],prev[1]+0.1,prev[2]]
                case "ArrowDown":
                    return [prev[0],prev[1]-0.1,prev[2]]
                case "ArrowLeft":
                    return [prev[0]-0.1,prev[1],prev[2]]
                case "ArrowRight":
                    return [prev[0]+0.1,prev[1],prev[2]]       
                default:
                    return prev;
            }
        });
    };

    useEffect(()=>{
        window.addEventListener("keydown",handleMovement);
        return()=>{
            window.removeEventListener("keydown",handleMovement);
        }
    },[handleMovement]);
    
    useFrame(()=>{
        if(avatarRef.current){
            avatarRef.current.position.set(...position);
        }
    });

  return (
    <mesh ref={avatarRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
      {/* Player name */}
      <Html position={[0, 1, 0]} center>
        <div style={{ color: "white", fontSize: "12px", textAlign: "center" }}>
          Anam
        </div>
      </Html>
    </mesh>

  );
};

export default Avatar;
