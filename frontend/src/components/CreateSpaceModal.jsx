import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../App.css";

const CreateSpaceModal = ({ isOpen, onClose, onSpaceCreated }) => {
  const [spaceName, setSpaceName] = useState("");
  const [config, setConfig] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();
    
  }
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
        <button className="close-btn" onClick={onClose}>X</button>
        </div>
      <form onSubmit={handleSubmit}>
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
          <select
            value={config.theme}
            onChange={(e) => setConfig({ ...config, theme: e.target.value })}
          >
            <option value="light">Light</option>
            {/* <option value="dark">Dark</option> */}
          </select>
        </label>
        <button className="modal-btn" type="submit">Create</button>
      </form>
    </Modal>
  );
};

export default CreateSpaceModal;
