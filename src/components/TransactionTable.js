import React from "react";
import "../styles/Transactions.css";

const TransactionTable = ({ transactions, filter }) => {
  // Filter transactions based on selected category
  const filteredTransactions = filter === "All" ? transactions : transactions.filter(txn => txn.category === filter);

  return (
    <div className="transactions-table-container">
      <h2>Recent Transactions</h2>
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
          {filteredTransactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.date}</td>
              <td>{txn.category}</td>
              <td>{txn.place}</td>
              <td>${txn.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
