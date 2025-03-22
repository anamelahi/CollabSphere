import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import CreateSpaceModal from "./CreateSpaceModal";
import JoinSpaceModal from "./JoinSpaceModal";
import { Link, useNavigate } from 'react-router-dom'
import SpaceCard from "./ui/SpaceCard";


const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [userClicked, setUserClicked] = useState(false);
  const nav = useNavigate();

  const handleUserClick =()=>{
    setUserClicked(!userClicked);
  }
  const handleLogout =()=>{
    axios.post("http://localhost:3000/api/logout",{},{withCredentials:true})
    .then(()=> window.location.href="/login")
    .catch((err)=>console.log(err))
  }

  //Fetches user info and SSpaces
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/dashboard", { withCredentials: true })
      .then((res) => {
        console.log("API Response:", res.data); // Debugging 
        setUser(res.data.user);  // Update user state
        setSpaces(res.data.spaces);  // Update spaces state
        // console.log(user.userId);  
      })
      .catch((err) => console.log("Error fetching user and spaces:", err));
  }, []);
  
  //debugging useEffect
  // useEffect(() => {
  //   if (user) {
  //     console.log("Updated User:", user);
  //     console.log("UserId:", user.userId);
  //   }
  // }, [user]);

  const handleCreateSpace = () => {
    setIsModalOpen(true);
  };
  const handleJoinSpace = ()=>{
    setIsJoinModalOpen(true);
  }
  const handleCreatedSpace = (newSpace) =>{
    setSpaces([...spaces, newSpace]);
    console.log("These are the new spaces", newSpace);
  }
  const handleSpaceJoined = (newSpace)=>{
    setSpaces((prevSpaces) => [...prevSpaces, newSpace]); // Update state with new space
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" />
        <div className="user-div">
          <p onClick={handleUserClick}>{user ? user.name:"LOADING"}</p>
          {userClicked ? <button onClick={handleLogout} className="logout">Logout</button>:null}
        </div>
      </div>
      <div className="dashboard-body">
        <div className="dash-button-container">
          <button className="join-btn" onClick={handleJoinSpace}>Join a Space</button>
          <button className="create-btn" onClick={handleCreateSpace}>
            Create Space
          </button>
          <CreateSpaceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            email = {user?.email}
            onSpaceCreated={handleCreatedSpace}
          />
          <JoinSpaceModal isOpen={isJoinModalOpen} onClose={()=>setIsJoinModalOpen(false)} onSpaceJoined={handleSpaceJoined} userId={user?.userId}/>
        </div>
        <div className="space-container">
          <h2>My Spaces</h2>
          <ul>
        {spaces.map((space, index) => (
          <SpaceCard key={index} spaceId={space.spaceId} cardTitle={"abc"} ownerName={space.ownerName} userId={user.userId}/>
        ))}
      </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;