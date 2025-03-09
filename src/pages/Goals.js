import React, { useState, useEffect } from "react";
import "../styles/Goals.css";
import GoalsTable from "../components/GoalsTable";
import GoalsModal from "../components/GoalsModal";

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);

  // Fetch goals from the backend API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/goals");
        const data = await response.json();
        console.log("Fetched Goals:", data); // Debugging

        if (Array.isArray(data)) {
          setGoals(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  // Add a new goal
  const addGoal = async (newGoal) => {
    try {
        const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: newGoal.name, 
                // goal_amount: Number(newGoal.target)
                goal_amount: newGoal.target
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add goal: ${response.statusText}`);
        }

        // const savedGoal = await response.json();
        let savedGoal = await response.json();
        console.log("Goal Added Successfully:", savedGoal);

        // Make sure all data types are correct before updating state
        savedGoal = {
          ...savedGoal,
          target_amount: parseFloat(savedGoal.goal_amount),  // Convert from string to number
          saved_amount: parseFloat(savedGoal.saved_amount)   // Convert from string to number
      };
        // const formattedGoal = {
        //     goal_id: savedGoal.goal_id,
        //     goal_name: savedGoal.goal_name,
        //     goal_amount: parseFloat(savedGoal.goal_amount),
        //     saved_amount: parseFloat(savedGoal.saved_amount) || 0,
        // };

        // Update state using functional update to avoid stale state
        // setGoals(prevGoals => [...prevGoals, formattedGoal]);
        setGoals((prevGoals) => [...prevGoals, savedGoal]);
    } catch (error) {
        console.error("Error adding goal:", error);
    }
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
