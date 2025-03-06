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

              // Ensure values are properly parsed and prevent errors
              // const targetAmount = goal.goal_amount ? parseFloat(goal.goal_amount) : 0;
              // const savedAmount = goal.saved_amount ? parseFloat(goal.saved_amount) : 0;
              // const amountLeft = targetAmount - savedAmount;

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






// import React, { useEffect, useState } from "react";
// import "../styles/Goals.css";

// const GoalsTable = () => {
//   const [goals, setGoals] = useState([]);

//   // Fetch goals from API
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
//     <div className="goals-dashboard">
//       <table>
//         <thead>
//           <tr>
//             <th>Goal Name</th>
//             <th>Target</th>
//             <th>Saved</th>
//             <th>Left</th>
//           </tr>
//         </thead>
//         <tbody>
//           {goals.length > 0 ? (
//             goals.map((goal) => (
//               <tr key={goal.goal_id}>
//                 <td>{goal.goal_name}</td>
//                 <td>${goal.target_amount?.toLocaleString() || "0"}</td>  {/* ✅ Fixed */}
//                 <td>${goal.saved_amount?.toLocaleString() || "0"}</td>
//                 <td>${((goal.target_amount || 0) - (goal.saved_amount || 0)).toLocaleString()}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={{ textAlign: "center" }}>No goals found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GoalsTable;
