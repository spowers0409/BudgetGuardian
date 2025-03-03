import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BudgetAllocationChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No budget data available.</p>;
    }

    const categories = data.map(item => item.category);
    const budgetedAmounts = data.map(item => item.budgeted);
    const spentAmounts = data.map(item => item.spent);

    const chartData = {
        labels: categories,
        datasets: [
            {
                label: "Budgeted",
                data: budgetedAmounts,
                backgroundColor: "red",
            },
            {
                label: "Spent",
                data: spentAmounts,
                backgroundColor: spentAmounts.map((spent, index) =>
                    spent > budgetedAmounts[index] ? "orange" : "green"
                ),
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default BudgetAllocationChart;
