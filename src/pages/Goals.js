import React, { useState } from "react";
import "../styles/Goals.css";
import GoalsTable from "../components/GoalsTable";
import GoalsModal from "../components/GoalsModal";

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState([
    { name: "Emergency Fund", target: 5000, saved: 1200 },
    { name: "Vacation", target: 3000, saved: 800 },
    { name: "New Laptop", target: 1500, saved: 400 },
  ]);

  const addGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="goals-page">
      <h1 className="page-title">Goals</h1>

      <div className="goals-controls">
        <button className="add-goal-btn" onClick={() => setIsModalOpen(true)}>➕ Add Goal</button>
      </div>

      <GoalsTable goals={goals} />
      <GoalsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddGoal={addGoal} />
    </div>
  );
};

export default Goals;
