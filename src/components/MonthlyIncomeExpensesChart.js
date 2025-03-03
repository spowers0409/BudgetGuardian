import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyIncomeExpensesChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.month),
        datasets: [
            {
                label: "Income",
                data: data.map((item) => item.income),
                backgroundColor: "green",
            },
            {
                label: "Expenses",
                data: data.map((item) => item.expenses),
                backgroundColor: "red",
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Important to control height
        scales: {
            x: {
                grid: {
                    display: false, // Hide vertical grid lines
                },
                ticks: {
                    font: {
                        size: 13, // Slightly smaller for a cleaner look
                    },
                    padding: 5, // Spacing below labels
                }
            },
            y: {
                grid: {
                    color: "#e0e0e0", // Light gray horizontal grid lines
                    borderDash: [4, 4], // Dotted lines
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    padding: 10, // Extra spacing on the Y-axis
                    callback: (value) => `$${value.toLocaleString()}`, // Format with $
                }
            }
        },
        plugins: {
            legend: {
                display: false, // Hide legend for a cleaner look
            },
            tooltip: {
                enabled: false, // No tooltips on hover
            }
        },
        barPercentage: 0.6, // Adjust bar thickness
        categoryPercentage: 0.5, // More spacing between bars
    };
    
    

    return <Bar data={chartData} options={options} />;
};

export default MonthlyIncomeExpensesChart;
