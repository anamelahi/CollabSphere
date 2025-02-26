import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../App.css";
// import Modal from "react-modal";

Modal.setAppElement("#root"); // Add this line at the top

const CreateSpaceModal = ({ isOpen, onClose, onSpaceCreated,email }) => {
  const [spaceName, setSpaceName] = useState("");
  // const [config, setConfig] = useState("");
  const [theme, setTheme] = useState("Light"); // Default theme

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    
    if (!spaceName) {
      console.log("Error: Space name is required.");
      return;
    }
  
    if (!email) {
      console.log("Error: User email is missing from localStorage.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/spaces", {
        email,
        spaceName,
        config: { theme },
      });
      
      if (response.status === 201) {
        console.log("Space created", response.data);
        setSpaceName("");
        setTheme("Light")
      }
    } catch (error) {
      console.log("Error creating space", error.response?.data || error.message);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="overlay"
      shouldCloseOnOverlayClick={false}
      className="modal"
    >
      <div className="modal-header">
        <h2>Create New Space</h2>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
      </div>
      <form method="post" onSubmit={handleCreateSpace}>
        <label>
          Space Name:
          <input
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            required
            placeholder="Enter Space Name"
          />
        </label>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </label>
        <button className="modal-btn" type="submit">
          Create
        </button>
      </form>
    </Modal>
  );
};

export default CreateSpaceModal;
