import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading..");

  const icons = {
    goals: {
    default: "/icons/goals.png",
    active: "/icons/goals_purple.png",
    },
  };

  const handleLogout = () => {
    console.log("Logging out..");

    localStorage.removeItem("token");

    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Sidebar: Retrieved token from localStorage:", token);

        if (!token) {
          console.warn("⚠ No token found! Setting user as Guest.");
          setUserName("Guest");
          return;
        }

        const response = await fetch("https://budgetguardian-backend.onrender.com/api/user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("🔍 Sidebar: API Response Status:", response.status);

        if (!response.ok) {
          console.error("Sidebar: Failed to fetch user data");
          setUserName("Guest");
          return;
        }

        const textResponse = await response.text();
        console.log("Sidebar: Raw Response:", textResponse);

        const data = JSON.parse(textResponse);
        console.log("Sidebar: Fetched User Data:", data);

        if (data.full_name) {
          setUserName(data.full_name);
        } else {
          console.warn("Sidebar: No valid name received, setting user as Guest.");
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Sidebar: Error fetching user:", error);
        setUserName("Guest");
      }
    };

    fetchUserData();
  }, []);


  return (
    <div id="sidebar">
      <div className="sidebar-logo">
        <img src="/bglogo.png" alt="BudgetGuardian" className="no-invert-logo" />
        <span className="sidebar-logo-text">BudgetGuardian</span>
      </div>
      <hr className="section-divider" />
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <img src="/icons/dashboard.png" alt="Dashboard" className="no-invert-icon" /> Dashboard
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
          <li>
            <Link to="/reports">
              <img src="/icons/reports.png" alt="Transactions" className="sidebar-icon" /> Reports
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

      <div className="sidebar-bottom">
        <hr className="section-divider" />
        <div className="sidebar-user">

          <img src="/icons/profile.png" alt="User" className="sidebar-user-icon" />
          <span>{userName}</span>
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>


    </div>
  );
}

export default Sidebar;
