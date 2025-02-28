import React from 'react'
import "./Ui.css"
import { HiOutlineDotsHorizontal } from "react-icons/hi";


const SpaceCard = () => {
  return (
    <div className='space-card'>
        <div className="preview">

        </div>
        <div className="desc">
            <HiOutlineDotsHorizontal/>
        </div>
    </div>
  )
}

export default SpaceCard