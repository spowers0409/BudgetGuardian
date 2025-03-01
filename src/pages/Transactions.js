import React, { useState, useEffect } from "react";
import "../styles/Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    transaction_date: "",
    category: "",
    place: "",
    amount: "",
  });

  // Fetch transactions from backend API
  useEffect(() => {
    // fetch("http://localhost:5000/api/transactions")
    fetch("https://budgetguardian-backend.onrender.com/api/transactions") // Render URL
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  // Fetch budget categories from backend API
  useEffect(() => {
    // fetch("http://localhost:5000/api/budget-categories")
    fetch("https://budgetguardian-backend.onrender.com/api/budget-categories") // Render URL
      .then((response) => response.json())
      // .then((data) => setBudgetCategories(data.map((item) => item.category))) // Before adding 'income'
      .then((data) => {
        const categories = data.map((item) => item.category);
        setBudgetCategories(["Income", ...categories]);
      })
      .catch((error) => console.error("Error fetching budget categories:", error));
  }, []);

  // Function to add a new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.transaction_date || !newTransaction.category || !newTransaction.place || !newTransaction.amount) {
      alert("Please fill out all fields.");
      return;
    }

    // fetch("http://localhost:5000/api/transactions", {
      fetch("https://budgetguardian-backend.onrender.com/api/transactions", { // Render URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions([data, ...transactions]);
        setNewTransaction({ transaction_date: "", category: "", place: "", amount: "" });
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error adding transaction:", error));
  };

  return (
    <div className="transactions-page">
      <h1 className="page-title">Transactions</h1>

      <div className="transactions-controls">
        <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
          ➕ Add Transaction
        </button>

        <select className="filter-dropdown">
          <option value="">Filter by:</option>
          {budgetCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Place</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className={tx.category === "Income" ? "income-row" : ""}> 
                <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                <td>{tx.category}</td>
                <td>{tx.place}</td>
                <td>${parseFloat(tx.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Transaction</h2>

            <label>Date:</label>
            <input
              type="date"
              value={newTransaction.transaction_date}
              onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
            />

            <label>Category:</label>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {budgetCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>

            <label>Place:</label>
            <input
              type="text"
              placeholder="Enter place (e.g. Walmart)"
              value={newTransaction.place}
              onChange={(e) => setNewTransaction({ ...newTransaction, place: e.target.value })}
            />

            <label>Amount:</label>
            <input
              type="number"
              placeholder="$0.00"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />

            <button onClick={handleAddTransaction}>Add</button>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
