import React from "react";
import "../styles/Dashboard.css";

const DashboardCard = ({ title, amount, percentage, icon }) => {
    return (
        <div className="dashboard-card">
            <div className="card-header">
                <img src={icon} alt={`${title} icon`} className="card-icon" />
                <h2>{title}</h2>
            </div>
            <p className="amount">${amount}</p>
            <p className={`percentage ${percentage >= 0 ? "positive" : "negative"}`}>
  {percentage >= 0 ? <span style={{ color: "green" }}>▲</span> : <span style={{ color: "red" }}>▼</span>}
  {Math.abs(percentage)}% from last month
</p>

        </div>
    );
};

export default DashboardCard;
