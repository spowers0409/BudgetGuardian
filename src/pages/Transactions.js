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

  useEffect(() => {
    console.log("useEffect triggered!");
    const fetchBudgetCategories = async () => {
      try {
          const response = await fetch("https://budgetguardian-backend.onrender.com/api/budget-categories");
          const data = await response.json();

      
          if (!Array.isArray(data)) {
              console.error("Unexpected API response format:", data);
              return;
          }

          const categories = data.map(item => {
              if (typeof item === "string") {
                  return item;
              } else if (typeof item === "object" && item.category) {
                  return item.category;
              } else {
                  console.warn("Skipping unexpected category format:", item);
                  return null; 
              }
          }).filter(Boolean);

          setBudgetCategories(categories);
          console.log("Processed Categories for Transactions Dropdown:", categories);
      } catch (error) {
          console.error("Error fetching budget categories:", error);
      }
    };
    fetchBudgetCategories();
  }, []);


  // Function to add a new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.transaction_date || !newTransaction.category || !newTransaction.place || !newTransaction.amount) {
        alert("Please fill out all fields.");
        return;
    }

    // Determine transaction type based on category
    const incomeCategories = ["Income", "Salary", "Paycheck", "Bonus"];
    const transactionType = incomeCategories.includes(newTransaction.category) ? "income" : "expense";

    fetch("https://budgetguardian-backend.onrender.com/api/transactions", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newTransaction,
            type: transactionType
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        setTransactions([data, ...transactions]);
        setNewTransaction({ transaction_date: "", category: "", place: "", amount: "", type: "" }); 
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
