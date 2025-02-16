import React, { useState } from "react";
import "../styles/Transactions.css";

const TransactionModal = ({ setShowModal, setTransactions }) => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [place, setPlace] = useState("");
  const [amount, setAmount] = useState("");

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setTransactions(prev => [...prev, { date, category, place, amount: parseFloat(amount) }]);
    setShowModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Rent">Rent</option>
            <option value="Dining">Dining</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other (Add Category)</option>
          </select>

          <label>Place:</label>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required />

          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

          <button type="submit">Add Transaction</button>
          <button type="button" className="close-btn" onClick={() => setShowModal(false)}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
