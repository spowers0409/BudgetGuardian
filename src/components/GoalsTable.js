import React from "react";
import "../styles/Goals.css";

const GoalsTable = ({ goals }) => {
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
            goals.map((goal) => {
              console.log("DEBUG: Goal Data -", goal);

              return (
                <tr key={goal.goal_id}>
                  <td>{goal.goal_name}</td>
                  <td>${goal.target_amount?.toLocaleString() || "0"}</td> 
                  <td>${goal.saved_amount?.toLocaleString() || "0"}</td>
                  <td>${((goal.target_amount || 0) - (goal.saved_amount || 0)).toLocaleString()}</td>
                </tr>
              );
            })
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