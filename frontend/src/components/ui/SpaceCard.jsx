import React from 'react'
import "./Ui.css"
import { useNavigate } from 'react-router-dom';
import { HiOutlineDotsHorizontal } from "react-icons/hi";


const SpaceCard = (props) => {
  const nav = useNavigate();
  const handleClick = () =>{
    nav(`/office/${props.spaceId}`)
  }
  return (
    <div className='space-card'>
        <div onClick={handleClick} className="preview">
          <p>{props.spaceId}</p>
        </div>
        <div className="desc">
          <p>{props.cardTitle}</p>
          <p>Owned by: {props.ownerName}</p>
            {/* <HiOutlineDotsHorizontal/> */}
        </div>
    </div>
  )
}

export default SpaceCard