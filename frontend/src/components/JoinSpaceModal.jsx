import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../App.css";

Modal.setAppElement("#root");

const JoinSpaceModal = ({ isOpen, onClose, onSpaceJoined, userId }) => {
    const [spaceId, setSpaceId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinSpace = async(e)=>{
        e.preventDefault();

        if(!spaceId){
            alert("Enter space id");
            console.log("Error: Space id is required.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/api/join-space",{
                spaceId,
                userId,
            },{withCredentials:true}); //it ensures that cookies are sent if using session authentication
            if(response.status===200){
                alert("successfully joined the space")
                setSpaceId("");
                onClose(); //to close the modal
                onSpaceJoined(response.data); //to notify the parent element
            }
        } catch (error) {
            console.error("Error joining space", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to join space. Please check the Space ID.");
        }finally{
            setLoading(false);
        }
    };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} overlayClassName="overlay" className="modal">
        <div className="modal-header">
        <h2>Create New Space</h2>
        <button onClick={onClose} className="close-btn">
          X
        </button>
        </div>
        <form method="post" onSubmit={handleJoinSpace}>
        <label>
          Space Id:
          <input
            type="text"
            value={spaceId}
            onChange={(e) => setSpaceId(e.target.value)}
            required
            placeholder="Enter Space Id"
          />
        </label>
        <button className="modal-btn" type="submit">
          {loading ? "Joining...": "Join"}
        </button>
      </form>
    </Modal>
  )
}

export default JoinSpaceModal