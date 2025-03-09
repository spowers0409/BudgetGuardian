import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { trainSavingsModel } from "../ML/savingsTrendModel";
import * as tf from "@tensorflow/tfjs";
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";
import "../styles/Dashboard.css";

// Register Chart.js components
Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const NetSavingsCard = ({ netSavings, pastSavings, onToggle }) => {
    const [predictedSavings, setPredictedSavings] = useState([]);
  
    useEffect(() => {
      const fetchPredictions = async () => {
        if (pastSavings.length > 2) {
          const predictions = await trainSavingsModel(pastSavings);
          setPredictedSavings(predictions || []);
        }
      };
      fetchPredictions();

      return () => {
        console.log("🧹 Cleaning up TensorFlow tensors...");
        tf.disposeVariables();
      };
    }, [pastSavings]);

  return (
    <div className="dashboard-card flipped">
      <div className="card-back">
        <div style={{ width: "100%", maxWidth: "250px", height: "180px", overflow: "hidden" }}>
          {predictedSavings.length > 0 ? (
            <Line
            data={{
              labels: Array(6).fill(""),
              datasets: [
                {
                  label: "Projected Savings",
                  data: predictedSavings,
                  borderColor: "#9678c4",
                  backgroundColor: "#9678c4",
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: false,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let value = context.raw || 0;
          
                      // Dynamically generate months based on current month
                      const currentMonth = new Date().getMonth();
                      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                      const futureMonth = monthNames[(currentMonth + context.dataIndex + 1) % 12];
          
                      return `${futureMonth}: $${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    },
                  },
                },
              },
            }}
          />
          
          ) : (
            <p>Not enough data to show trend.</p>
          )}
        </div>
        {/* Flip Back Button */}
        <button className="flip-button" onClick={onToggle}>
          <img src="/icons/flip.png" alt="Flip Back" />
        </button>
      </div>
    </div>
  );
};

export default NetSavingsCard;
