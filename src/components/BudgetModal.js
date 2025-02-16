import React from "react";
import "../styles/Budget.css";

const BudgetModal = ({ isOpen, closeModal, newBudget, setNewBudget, handleAddBudget }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Budget</h2>

        <label>Category:</label>
        <input
          type="text"
          placeholder="Enter category name"
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
        />

        <label>Budget Amount:</label>
        <input
          type="number"
          placeholder="$0.00"
          value={newBudget.budgeted}
          onChange={(e) => setNewBudget({ ...newBudget, budgeted: e.target.value })}
        />

        <button onClick={handleAddBudget}>Add</button>
        <button className="close-btn" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default BudgetModal;
