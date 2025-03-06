import React, { useEffect, useState } from "react";
import "../styles/Goals.css";

const GoalsTable = () => {
  const [goals, setGoals] = useState([]);

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/goals");
        if (!response.ok) throw new Error("Failed to fetch goals");

        const data = await response.json();
        console.log("Fetched Goals:", data);
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="goals-dashboard">
      <table>
        <thead>
          <tr>
            <th>Goal Name</th>
            <th>Target</th>
            <th>Saved</th>
            <th>Left</th>
          </tr>
        </thead>
        <tbody>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <tr key={goal.goal_id}>
                <td>{goal.goal_name}</td>
                <td>${goal.target_amount.toLocaleString()}</td>
                <td>${goal.saved_amount.toLocaleString()}</td>
                <td>${(goal.target_amount - goal.saved_amount).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No goals found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GoalsTable;
