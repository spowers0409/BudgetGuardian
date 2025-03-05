import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";
import MonthlyIncomeExpensesChart from "../components/MonthlyIncomeExpensesChart";
import BudgetAllocationChart from "../components/BudgetAllocationChart";
import RecentTransactions from "../components/RecentTransactions";


const Dashboard = () => {
    const [totalBalance, setTotalBalance] = useState(null);
    const [previousBalance, setPreviousBalance] = useState(null);
    const [percentageChange, setPercentageChange] = useState(null);
    const [loading, setLoading] = useState(true); 

    // Income this month
    const [incomeThisMonth, setIncomeThisMonth] = useState(0);
    const [incomeChange, setIncomeChange] = useState(0);

    // Expenses this month
    const [expensesThisMonth, setExpensesThisMonth] = useState(0);
    const [expensesChange, setExpensesChange] = useState(0);

    // Net Savings
    const [netSavings, setNetSavings] = useState(0);
    const [savingsChange, setSavingsChange] = useState(0);

    // Monthly Income vs Expense
    const [monthlyData, setMonthlyData] = useState([]);

    // Budget Allocation by Category
    const [budgetData, setBudgetData] = useState([]);

    // Recent Transactions
    const [recentTransactions, setRecentTransactions] = useState([]);




    useEffect(() => {
        // const fetchTotalBalance = async () => {
        //     try {
        //         // const response = await fetch("/api/dashboard/total-balance");
        //         const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/total-balance", {
        //             method: "GET",
        //             headers: {
        //                 "Cache-Control": "no-cache. no-store, must-revalidate",
        //                 "Pragma": "no-cache",
        //                 "Expires": "0"
        //             }
        //         });

        //         if (!response.ok) {
        //             throw new Error(`HTTP Error! Status: ${response.status}`);
        //         }


        //         // const text = await response.text();
        //         // console.log("Raw API Response:", text); // Add this to debug
        //         // const data = JSON.parse(text);

        //         const data = await response.json();

        //         //const data = await response.json();

        //         if (!data || typeof data.totalBalance === "undefined") {
        //             console.error("Invalid API response:", data);
        //             return;
        //         }

        //         setTotalBalance(data.totalBalance ?? 0);
        //         setPreviousBalance(data.previousBalance ?? 0);
        //         setPercentageChange(data.percentageChange ?? 0);
        //         setLoading(false);
        //     } catch (error) {
        //         console.error("Error fetching total balance:", error);
        //         // setLoading(false)
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        const API_BASE_URL = window.location.hostname === "localhost"
            ? "http://localhost:10000/api/dashboard"
            : "https://budgetguardian-backend.onrender.com/api/dashboard";

        const fetchTotalBalance = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/total-balance`);
                const text = await response.text();
                console.log("Raw API Response:", text); // Debugging log
        
                const data = JSON.parse(text);
                console.log("Parsed API Data:", data); // Add this line
        
                setTotalBalance(data.totalBalance ?? 0);
                setPreviousBalance(data.previousBalance ?? 0);
                setPercentageChange(data.percentageChange ?? 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching total balance:", error);
                setLoading(false);
            }
        };

        
        const fetchIncomeThisMonth = async () => {
            try {
                // const response = await fetch("https://budgetguardian-backend.onrender.com/api/dashboard/income-this-month");
                const response = await fetch(`${API_BASE_URL}/income-this-month`);
                const text = await response.text();
                console.log("Raw Income API Response:", text);

                const data = JSON.parse(text);
                console.log("Parseed API Data:", data);

                setIncomeThisMonth(data.currentIncome ?? 0);
                setIncomeChange(data.percentageChange ?? 0);
            } catch (error) {
                console.error("Error fetching income this month:", error);
            }
        };
        
        const fetchExpensesThisMonth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/expenses-this-month`);
                const text = await response.text();
                console.log("Raw Expenses API Response:", text);
        
                const data = JSON.parse(text);
                console.log("Parsed Expenses API Data:", data);
        
                setExpensesThisMonth(data.currentExpenses ?? 0);
                setExpensesChange(data.percentageChange ?? 0);
            } catch (error) {
                console.error("Error fetching expenses this month:", error);
            }
        };

        const fetchNetSavings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/net-savings`);
                const text = await response.text();
                console.log("Raw Net Savings API Response:", text);
        
                const data = JSON.parse(text);
                console.log("Parsed Net Savings API Data:", data);
        
                setNetSavings(data.currentNetSavings ?? 0);
                setSavingsChange(data.percentageChange ?? 0);
            } catch (error) {
                console.error("Error fetching net savings:", error);
            }
        };

        const fetchMonthlyData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/monthly-income-expenses`);
                const text = await response.text();
                console.log("Raw Monthly API Response:", text);
        
                const data = JSON.parse(text);
                console.log("Parsed Monthly Data:", data);
        
                setMonthlyData(data);
            } catch (error) {
                console.error("Error fetching monthly income vs expenses:", error);
            }
        };

        const fetchBudgetAllocation = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/budget-allocation`);
                const text = await response.text();
                console.log("Raw Budget API Response:", text);

                const data = JSON.parse(text);
                console.log("Parsed Budget API Data:", data);

                setBudgetData(data);
            } catch (error) {
                console.error("Error fetching budget allocation:", error);
            }
        };
        
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/recent-transactions`);
                const text = await response.text();
                console.log("Raw Transactions API Response:", text);
        
                const data = JSON.parse(text);
                console.log("Parsed Transactions API Data:", data);
        
                setRecentTransactions(data);
            } catch (error) {
                console.error("Error fetching recent transactions:", error);
            }
        };    
        
        

        fetchTotalBalance();
        fetchIncomeThisMonth();
        fetchExpensesThisMonth();
        fetchNetSavings();
        fetchMonthlyData();
        fetchBudgetAllocation();
        fetchTransactions();
    }, []);

    const formatCurrency = (amount) => {
        if (typeof amount !== "number" || isNaN(amount)) {
            return "0.00";
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
                    loading={loading}
                />
                <DashboardCard
                    title="Income This Month"
                    amount={formatCurrency(incomeThisMonth)}
                    percentage={incomeChange}
                    icon="/icons/income.png"
                />
                <DashboardCard
                    title="Expenses This Month"
                    amount={formatCurrency(expensesThisMonth)}
                    percentage={expensesChange}
                    icon="/icons/expenses.png"
                />
                <DashboardCard
                    title="Net Savings"
                    amount={formatCurrency(netSavings)}
                    percentage={savingsChange}
                    icon="/icons/savings.png"
                />

                {/* <DashboardCard title="Total Balance" amount="12,345.67" percentage={5} icon="/icons/balance.png" /> */}
                {/* <DashboardCard title="Income This Month" amount="4,200.00" percentage={2} icon="/icons/income.png" /> */}
                {/* <DashboardCard title="Expenses This Month" amount="2,300.00" percentage={-1} icon="/icons/expenses.png" /> */}
                {/* <DashboardCard title="Net Savings" amount="1,900.00" percentage={4} icon="/icons/savings.png" /> */}
            </div>

            {/* Rows 2, 3, 4 - Chart Cards */}
            <div className="dashboard-charts">
                {/* Row 2 */}

                <div className="chart-card">
                    <h2>Monthly Income vs Expenses</h2>
                    <div className="chart-container">
        <               MonthlyIncomeExpensesChart data={monthlyData} />
                    </div>
                </div>
                <div className="chart-card">
                    <h2>Budget Allocation by Category</h2>
                    <div className="chart-container">
                        <BudgetAllocationChart data={budgetData} />
                    </div>
                </div>
                <div className="chart-card">
                    <h2>Recent Transactions</h2>
                    <RecentTransactions transactions={recentTransactions} />
                </div>



                {/* <div className="chart-card">
                    <h2>Monthly Income vs Expenses</h2>
                    <p>Placeholder for chart</p>
                </div> */}

                {/* <div className="chart-card">
                    <h2>Budget Allocation by Category</h2>
                    <p>Placeholder for chart</p>
                </div> */}

                {/* Row 3 */}
                {/* <div className="chart-card">
                    <h2>Recent Transactions</h2>
                    <p>Placeholder for table</p>
                </div> */}
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
