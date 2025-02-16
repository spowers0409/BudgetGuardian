import React from "react";
import "../styles/Budget.css";

const BudgetTable = ({ budgets }) => {
  return (
    <div className="budget-table-container">
      <h2>Budget Overview</h2>
      <table className="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Spent</th>
            <th>Left</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget, index) => (
            <tr key={index}>
              <td>{budget.category}</td>
              <td>${budget.budgeted.toFixed(2)}</td>
              <td>${budget.spent.toFixed(2)}</td>
              <td>${budget.left.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable;
