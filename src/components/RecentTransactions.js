import React from "react";
import "../styles/Dashboard.css";

const RecentTransactions = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return <p className="no-transactions">No recent transactions available.</p>;
    }

    return (
        <div className="recent-transactions-container">
            <table className="recent-transactions-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
            </table>
            <div className="recent-transactions-scrollable">
                <table className="recent-transactions-table">
                    <tbody>
                        {transactions.slice(0, 10).map((transaction, index) => (
                            <tr key={index}>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>{transaction.category}</td>
                                <td className="transaction-amount">${transaction.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;
