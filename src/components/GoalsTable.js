import React from "react";
import "../styles/Goals.css";

const GoalsTable = ({ goals }) => {
  return (
    <div className="goals-dashboard">
      {/* <h2>Goal Progress</h2> */}
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
          {goals.map((goal, index) => (
            <tr key={index}>
              <td>{goal.name}</td>
              <td>${goal.target.toLocaleString()}</td>
              <td>${goal.saved.toLocaleString()}</td>
              <td>${(goal.target - goal.saved).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoalsTable;
