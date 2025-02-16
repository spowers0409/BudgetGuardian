import React, { useState, useEffect } from "react";
import BudgetModal from "../components/BudgetModal";
import "../styles/Budget.css";

const Budget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgeted: "",
  });

  // Fetch budgets from the backend when the component loads
  useEffect(() => {
    fetch("http://localhost:5000/api/budgets")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Budgets:", data);
        setBudgets(data);
      })
      .catch((error) => console.error("Error fetching budgets:", error));
  }, []);

  // Function to add a new budget to the backend
  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.budgeted) {
      alert("Please fill out all fields.");
      return;
    }

    const budgetAmount = parseFloat(newBudget.budgeted);

    fetch("http://localhost:5000/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: newBudget.category,
        budgeted: budgetAmount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Added Budget:", data);
        setBudgets([...budgets, data]);
        setNewBudget({ category: "", budgeted: "" });
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error adding budget:", error));
  };

  return (
    <div className="budget-page">
      <h1 className="page-title">Budgets</h1>

      {/* Top Controls */}
      <div className="budget-controls">
        <button className="add-budget-btn" onClick={() => setIsModalOpen(true)}>
          ➕ Add Budget
        </button>
      </div>

      {/* Budget Table */}
      <div className="budget-table-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget, index) => (
              <tr key={index}>
                <td>{budget.category}</td>
                <td>${parseFloat(budget.budgeted).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        handleAddBudget={handleAddBudget}
      />
    </div>
  );
};

export default Budget;
