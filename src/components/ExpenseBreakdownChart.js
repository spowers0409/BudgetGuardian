import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = ({ data, totalExpenses }) => {
    if (data.length === 0) return <p>No expenses recorded this month.</p>;

    // Define colors for the chart
    const colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FFCD56"
    ];

    // Chart Data
    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
            {
                data: data.map(item => item.total),
                backgroundColor: colors.slice(0, data.length),
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    // Chart Options
    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const category = data[tooltipItem.dataIndex];
                        return `${category.category}: $${category.total.toLocaleString()} (${category.percentage}%)`;
                    },
                },
            },
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: `Total Expenses: $${totalExpenses.toLocaleString()}`,
                font: { size: 16 },
            },
        },
    };

    return (
        <div className="expense-chart-card">
            {/* <h2>Expense Breakdown</h2> */}
            <Doughnut data={chartData} options={chartOptions} />
        </div>
    );
};

export default ExpenseBreakdownChart;
