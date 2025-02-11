import React from "react";
import logo from "../../public/logo.png";
import "../App.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={logo} alt="Logo" />
        <p>Profile</p>
      </div>
      <div className="dashboard-body">
        <div className="dash-button-container">
          <button className="join-btn">Join a Space</button>
          <button className="create-btn">Create Space</button>
        </div>
        <div className="space-container">
            <h2>My Spaces</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
