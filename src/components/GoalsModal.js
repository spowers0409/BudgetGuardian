import React, { useState } from "react";
import "../styles/Goals.css";

const GoalsModal = ({ isOpen, onClose, onAddGoal }) => {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalName || !target || isNaN(target) || isNaN(saved)) {
      alert("Please enter valid goal details.");
      return;
    }
    onAddGoal({ name: goalName, target: parseFloat(target), saved: parseFloat(saved) });
    setGoalName("");
    setTarget("");
    setSaved("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Goal</h2>
        <form onSubmit={handleSubmit}>
          <label>Goal Name:</label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Enter goal name"
            required
          />

          <label>Target Amount:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target amount"
            required
          />

          <label>Amount Saved:</label>
          <input
            type="number"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            placeholder="Enter amount saved"
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">Save Goal</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalsModal;