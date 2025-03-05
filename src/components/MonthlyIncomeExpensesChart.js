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
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 13,
                    },
                    padding: 5,
                }
            },
            y: {
                grid: {
                    color: "#e0e0e0",
                    borderDash: [4, 4],
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    padding: 10,
                    callback: (value) => `$${value.toLocaleString()}`,
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            }
        },
        barPercentage: 0.6,
        categoryPercentage: 0.5,
    };
    
    

    return <Bar data={chartData} options={options} />;
};

export default MonthlyIncomeExpensesChart;
