import React from 'react'
import { HeroHighlight } from './ui/hero-highlight'
import "../App.css"
import { Link } from 'react-router-dom'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate();
  return (
    <div className='home-container'>
        <HeroHighlight/>
        <div className='button-container'>
            <button onClick={()=>navigate("/login")}>Login</button>
            {/* <Link to="/signup">Signup</Link> */}
        </div>

    </div>





  )
}

export default Home