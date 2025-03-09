import React from "react";
import "../styles/DashboardCard.css";

const DashboardCard = ({ title, amount, percentage, icon, onToggle }) => {
    return (
        <div className="dashboard-card">
            <div className="card-header">
                <img src={icon} alt={`${title} Icon`} className="card-icon" />
                <h3>{title}</h3>
            </div>
            <div className="card-content">
                <h2>${amount}</h2>
                <p className={`percentage-change ${percentage >= 0 ? "positive" : "negative"}`}>
                    {percentage}% from last month
                </p>
            </div>
            {/* Flip Button */}
            {onToggle && (
                <button className="flip-button" onClick={onToggle}>
                    <img src="/icons/flip.png" alt="Flip" className="flip-icon" />
                </button>
            )}
        </div>
    );
};

export default DashboardCard;



// Working DashboardCard.js
// import React from "react";
// import "../styles/Dashboard.css";

// const DashboardCard = ({ title, amount, percentage, icon }) => {
//     return (
//         <div className="dashboard-card">
//             <div className="card-header">
//                 <img src={icon} alt={`${title} icon`} className="card-icon" />
//                 <h2>{title}</h2>
//             </div>
//             <p className="amount">${amount}</p>
//             <p className={`percentage ${percentage >= 0 ? "positive" : "negative"}`}>
//   {percentage >= 0 ? <span style={{ color: "green" }}>▲</span> : <span style={{ color: "red" }}>▼</span>}
//   {Math.abs(percentage)}% from last month
// </p>

//         </div>
//     );
// };

// export default DashboardCard;
