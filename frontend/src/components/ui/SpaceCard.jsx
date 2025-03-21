import React,{useEffect} from 'react'
import "./Ui.css"
import { useNavigate } from 'react-router-dom';
import {io} from "socket.io-client"

const socket = io("http://localhost:3000");

const SpaceCard = (props) => {
  const nav = useNavigate();
//   const handleClick = () =>{
//     console.log("Emitting join-space:", props.spaceId, props.userId);
// // socket.emit("join-space", { spaceId, userId });

//     socket.emit("join-space", { spaceId: props.spaceId, userId: props.userId });
//     // console.log("Emitting join-space with userId:", props.userId);
//     nav(`/office/${props.spaceId}`)
//     // onJoin(spaceId, socket); // Pass socket to the Phaser scene
//   }
const handleClick = () => {
  console.log("Socket ID:", socket.id);  // Debugging purpose
  console.log("Emitting join-space:", props.spaceId, props.userId);
  socket.emit("join-space", { spaceId: props.spaceId, userId: props.userId });
  nav(`/office/${props.spaceId}`);
};

  return (
    <div className='space-card'>
        <div onClick={handleClick} className="preview">
          <p>{props.spaceId}</p>
        </div>
        <div className="desc">
          <p>{props.cardTitle}</p>
          <p>Owned by: {props.ownerName}</p>
          <p>id:{props.userId}</p>
            {/* <HiOutlineDotsHorizontal/> */}
        </div>
    </div>
  )
}

export default SpaceCard