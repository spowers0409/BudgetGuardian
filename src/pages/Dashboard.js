import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [totalBalance, setTotalBalance] = useState(null);
    const [previousBalance, setPreviousBalance] = useState(null);
    const [percentageChange, setPercentageChange] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchTotalBalance = async () => {
            try {
                // const response = await fetch("/api/dashboard/total-balance");
                const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/total-balance", {
                    method: "GET",
                    headers: {
                        "Cache-Control": "no-cache. no-store, must-revalidate",
                        "Pragma": "no-cache",
                        "Expires": "0"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }


                // const text = await response.text();
                // console.log("Raw API Response:", text); // Add this to debug
                // const data = JSON.parse(text);

                const data = await response.json();

                //const data = await response.json();

                if (!data || typeof data.totalBalance === "undefined") {
                    console.error("Invalid API response:", data);
                    return;
                }

                setTotalBalance(data.totalBalance ?? 0);
                setPreviousBalance(data.previousBalance ?? 0);
                setPercentageChange(data.percentageChange ?? 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching total balance:", error);
                // setLoading(false)
            } finally {
                setLoading(false);
            }
        };

        fetchTotalBalance();
    }, []);

    const formatCurrency = (amount) => {
        if (typeof amount !== "number" || isNaN(amount)) {
            return "$0.00";
        }
        return `${amount.toLocaleString()}`;
        //return amount !== null ? `${amount.toLocaleString()}` : "N/A";
        // return amount;
    };

    return (
        <div className="dashboard">
            <h1 className="page-title">Dashboard</h1>

            {/* Row 1 - Summary Cards with Icons */}
            <div className="dashboard-widgets">
                <DashboardCard
                    title="Total Balance"
                    amount={formatCurrency(totalBalance)}
                    percentage={percentageChange}
                    previousBalance={formatCurrency(previousBalance)}
                    icon="/icons/balance.png"
                    loading={loading} />
                {/* <DashboardCard title="Total Balance" amount="12,345.67" percentage={5} icon="/icons/balance.png" /> */}
                <DashboardCard title="Income This Month" amount="4,200.00" percentage={2} icon="/icons/income.png" />
                <DashboardCard title="Expenses This Month" amount="2,300.00" percentage={-1} icon="/icons/expenses.png" />
                <DashboardCard title="Net Savings" amount="1,900.00" percentage={4} icon="/icons/savings.png" />
            </div>

            {/* Rows 2, 3, 4 - Chart Cards */}
            <div className="dashboard-charts">
                {/* Row 2 */}
                <div className="chart-card">
                    <h2>Monthly Income vs Expenses</h2>
                    <p>Placeholder for chart</p>
                </div>
                <div className="chart-card">
                    <h2>Budget Allocation by Category</h2>
                    <p>Placeholder for chart</p>
                </div>

                {/* Row 3 */}
                <div className="chart-card">
                    <h2>Recent Transactions</h2>
                    <p>Placeholder for table</p>
                </div>
                <div className="chart-card">
                    <h2>Savings Goals Progress</h2>
                    <p>Placeholder for progress chart</p>
                </div>

                {/* Row 4 */}
                <div className="chart-card">
                    <h2>Cash Flow Chart</h2>
                    <p>Placeholder for chart</p>
                </div>
                <div className="chart-card">
                    <h2>Expense Breakdown</h2>
                    <p>Placeholder for breakdown</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
