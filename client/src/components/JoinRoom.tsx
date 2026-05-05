import React, { useState } from 'react';
import '../css/joinRoom.css';

function JoinRoom() {
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [cfHandle, setCfHandle] = useState("");

  const handleJoin = () => {
    if (!roomId.trim() || !cfHandle.trim()) {
      alert("Please fill in both fields!");
      return;
    }
    console.log("Joining room:", roomId, "as:", cfHandle);
    // your join logic here, e.g: navigate(`/room/${roomId}`)
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setRoomId("");
    setCfHandle("");
  };

  return (
    <div>
      {/* Join Room Button */}
      <button onClick={() => setShowModal(true)} className="join-btn">
        Join Room
      </button>

      {/* Modal Popup */}
      {showModal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            {/* Close X button */}
            <button className="close-btn" onClick={closeModal}>✕</button>

            <h2>Join a Room</h2>

            <div className="field">
              <label>Room ID</label>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field">
              <label>Codeforces Handle</label>
              <input
                type="text"
                placeholder="e.g. tourist"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            <button className="join-submit-btn" onClick={handleJoin}>
              Join Room
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default JoinRoom;