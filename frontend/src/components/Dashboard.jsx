import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import CreateSpaceModal from "./CreateSpaceModal";
import { Link, useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userClicked, setUserClicked] = useState(false);
  const nav = useNavigate();

  const handleUserClick =()=>{
    setUserClicked(!userClicked);
  }
  const handleLogout =()=>{
    axios.post("http://localhost:3000/logout",{},{withCredentials:true})
    .then(()=> window.location.href="/login")
    .catch((err)=>console.log(err))
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log("Error fetching user in the dashboard", err));
  }, []);

  const handleCreateSpace = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" />
        <div className="user-div">
          <p onClick={handleUserClick}>{user ? `${user.first_name}` :"LOADING"}</p>
          {userClicked ? <button onClick={handleLogout} className="logout">Logout</button>:null}
        </div>
      </div>
      <div className="dashboard-body">
        <div className="dash-button-container">
          <button className="join-btn">Join a Space</button>
          <button className="create-btn" onClick={handleCreateSpace}>
            Create Space
          </button>
          <CreateSpaceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            email = {user?.email}
          />
        </div>
        <div className="space-container">
          <h2>My Spaces</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
