import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

const GoalsProgressChart = ({ updateDashboardData }) => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

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

  // Handle adding money to a goal
  const handleAddMoney = async () => {
    if (!selectedGoal || isNaN(amountToAdd) || amountToAdd <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    try {
        const response = await fetch(
            `https://budgetguardian-backend.onrender.com/api/dashboard/goals/${selectedGoal.goal_id}/add-savings`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(amountToAdd) }),
            }
        );

        if (!response.ok) throw new Error("Failed to update goal savings");

        const data = await response.json();
        console.log("Updated Goal Response:", data);

        if (!data.goal || typeof data.goal.saved_amount === "undefined") {
            console.error("Missing saved_amount in response:", data);
            return;
        }

        // Update UI
        setGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.goal_id === data.goal.goal_id
                    ? { ...goal, saved_amount: data.goal.saved_amount }
                    : goal
            )
        );

        // Trigger Dashboard Refresh
        updateDashboardData();

        setSelectedGoal(null);
        setAmountToAdd("");
    } catch (error) {
        console.error("Error updating savings:", error);
    }
};






  return (
    <div className="goals-progress-container">
      <div className="goals-progress-list">
        {goals.map((goal) => {
          const progressPercentage = goal.target_amount
            ? (goal.saved_amount / goal.target_amount) * 100
            : 0;

          return (
            <div className="goal-item" key={goal.goal_id}>
              <div className="goal-header">
                <span className="goal-name">{goal.goal_name}</span>
                <button
                  className="add-money-btn"
                  onClick={() => setSelectedGoal(goal)}
                >
                  ➕
                </button>
                <span className="goal-progress">
                  ${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Money Modal */}
      {selectedGoal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Money to {selectedGoal.goal_name}</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddMoney} className="save-btn">
                Save
              </button>
              <button onClick={() => setSelectedGoal(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsProgressChart;





// import React, { useEffect, useState } from "react";
// import "../styles/Dashboard.css";

// const GoalsProgressChart = () => {
//   const [goals, setGoals] = useState([]);

//   useEffect(() => {
//     const fetchGoals = async () => {
//       try {
//         const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/goals");
//         if (!response.ok) throw new Error("Failed to fetch goals");

//         const data = await response.json();
//         console.log("Fetched Goals:", data);
//         setGoals(data);
//       } catch (error) {
//         console.error("Error fetching goals:", error);
//       }
//     };

//     fetchGoals();
//   }, []);

//   return (
//     <div className="goals-progress-container">
//       <div className="goals-progress-list">
//         {goals.map((goal) => {
//           const progressPercentage = goal.target_amount
//             ? (goal.saved_amount / goal.target_amount) * 100
//             : 0; // Prevent NaN if target_amount is 0

//           return (
//             <div className="goal-item" key={goal.goal_id}>
//               <div className="goal-info">
//                 <span className="goal-name">{goal.goal_name}</span>
//                 <span className="goal-progress">
//                   ${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
//                 </span>
//               </div>
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default GoalsProgressChart;