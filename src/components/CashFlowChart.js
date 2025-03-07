import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CashFlowChart = ({ data }) => {
    // Chart data
    const chartData = {
        labels: data.map((item) => item.month), // X-axis labels
        datasets: [
            {
                label: "Expenses",
                data: data.map((item) => item.expenses),
                backgroundColor: "rgba(255, 87, 51, 0.7)", // Red with transparency
                borderColor: "rgba(255, 87, 51, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Hide legend since there's only one dataset
            title: {
                display: true,
                text: "Monthly Cash Flow (Expenses)",
                font: { size: 16 },
            },
        },
        scales: {
            x: { grid: { display: false } }, // Hide x-axis grid lines
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="chart-card">
            {/* <h2>Cash Flow (Monthly Expenses)</h2> */}
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default CashFlowChart;
