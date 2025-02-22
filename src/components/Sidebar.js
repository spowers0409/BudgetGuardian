import React from "react";
import { Link, useLocation } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  const icons = {
    goals: {
    default: "/icons/goals.png",
    active: "/icons/goals_purple.png",
    },
  };

  return (
    <div id="sidebar">
      <div className="sidebar-logo">
        <img src="/bglogo.png" alt="BudgetGuardian" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">BudgetGuardian</span>
      </div>
      <hr className="section-divider" />
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src="/icons/dashboard.png" alt="Dashboard" className="sidebar-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/transactions">
              <img src="/icons/transactions.png" alt="Transactions" className="sidebar-icon" /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/budget">
              <img src="/icons/budget.png" alt="Budget" className="sidebar-icon" /> Budget
            </Link>
          </li>
          <li>
            <Link to="/goals">
              <img className="sidebar-icon" src={location.pathname === "/goals" ? icons.goals.active : icons.goals.default} alt="Goals" />
              Goals
            </Link>
          </li>
          <hr className="section-divider" />
          <li>
            <Link to="/settings">
              <img src="/icons/settings.png" alt="Settings" className="sidebar-icon" /> Settings
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <img src="/icons/profile.png" alt="Profile" className="sidebar-icon" /> Profile
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <img src="/icons/contact.png" alt="Contact" className="sidebar-icon" /> Contact Us
            </Link>
          </li>
        </ul>
      </nav>

      <hr className="section-divider" />
      <div className="sidebar-user">
        <img src="/icons/profile.png" alt="User" className="sidebar-user-icon" />
        <span>Samuel P.</span>
      </div>
    </div>
  );
}

export default Sidebar;
