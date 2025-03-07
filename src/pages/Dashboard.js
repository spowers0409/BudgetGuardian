import React, { useEffect, useState, useCallback } from "react";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";
import MonthlyIncomeExpensesChart from "../components/MonthlyIncomeExpensesChart";
import BudgetAllocationChart from "../components/BudgetAllocationChart";
import RecentTransactions from "../components/RecentTransactions";
import GoalsProgressChart from "../components/GoalsProgressChart";
import CashFlowChart from "../components/CashFlowChart";
import ExpenseBreakdownChart from "../components/ExpenseBreakdownChart";


const Dashboard = () => {
    const [totalBalance, setTotalBalance] = useState(null);
    const [previousBalance, setPreviousBalance] = useState(null);
    const [percentageChange, setPercentageChange] = useState(null);

    const [incomeThisMonth, setIncomeThisMonth] = useState(0);
    const [incomeChange, setIncomeChange] = useState(0);

    const [expensesThisMonth, setExpensesThisMonth] = useState(0);
    const [expensesChange, setExpensesChange] = useState(0);

    const [netSavings, setNetSavings] = useState(0);
    const [savingsChange, setSavingsChange] = useState(0);

    const [monthlyData, setMonthlyData] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const [monthlyExpenses, setMonthlyExpenses] = useState([]);

    const [expenseBreakdown, setExpenseBreakdown] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const API_BASE_URL = window.location.hostname === "localhost"
        ? "http://localhost:10000/api/dashboard"
        : "https://budgetguardian-backend.onrender.com/api/dashboard";

    // Fetch Total Balance
    const fetchTotalBalance = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/total-balance`);
            const data = await response.json();
            setTotalBalance(data.totalBalance ?? 0);
            setPreviousBalance(data.previousBalance ?? 0);
            setPercentageChange(data.percentageChange ?? 0);
        } catch (error) {
            console.error("Error fetching total balance:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Income This Month
    const fetchIncomeThisMonth = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/income-this-month`);
            const data = await response.json();
            setIncomeThisMonth(data.currentIncome ?? 0);
            setIncomeChange(data.percentageChange ?? 0);
        } catch (error) {
            console.error("Error fetching income this month:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Expenses This Month
    const fetchExpensesThisMonth = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses-this-month`);
            const data = await response.json();
            setExpensesThisMonth(data.currentExpenses ?? 0);
            setExpensesChange(data.percentageChange ?? 0);
        } catch (error) {
            console.error("Error fetching expenses this month:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Net Savings
    const fetchNetSavings = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/net-savings`);
            const data = await response.json();
            setNetSavings(data.currentNetSavings ?? 0);
            setSavingsChange(data.percentageChange ?? 0);
        } catch (error) {
            console.error("Error fetching net savings:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Monthly Data
    const fetchMonthlyData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/monthly-income-expenses`);
            const data = await response.json();
            setMonthlyData(data);
        } catch (error) {
            console.error("Error fetching monthly income vs expenses:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Budget Allocation
    const fetchBudgetAllocation = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/budget-allocation`);
            const data = await response.json();
            setBudgetData(data);
        } catch (error) {
            console.error("Error fetching budget allocation:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Recent Transactions
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/recent-transactions`);
            const data = await response.json();
            setRecentTransactions(data);
        } catch (error) {
            console.error("Error fetching recent transactions:", error);
        }
    }, [API_BASE_URL]);

    const fetchMonthlyExpenses = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/monthly`);
            const data = await response.json();
            console.log("Fetched Monthly Expenses:", data);
    
            // Ensure all months are present
            const allMonths = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
    
            const formattedData = allMonths.map((month) => {
                const monthData = data.find((item) => item.month === month);
                return {
                    month,
                    expenses: monthData ? parseFloat(monthData.total_expenses) : 0,
                };
            });
    
            setMonthlyExpenses(formattedData);
        } catch (error) {
            console.error("Error fetching monthly expenses:", error);
        }
    }, [API_BASE_URL]);

    // Fetch Expense Breakdown
    const fetchExpenseBreakdown = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expense-breakdown`);
            const data = await response.json();
            console.log("Fetched Expense Breakdown:", data);

            setTotalExpenses(data.totalExpenses);
            setExpenseBreakdown(data.breakdown);
        } catch (error) {
            console.error("Error fetching expense breakdown:", error);
        }
    }, [API_BASE_URL]);
    
    

    // Update dashboard data when goals are updated
    const updateDashboardData = useCallback(async () => {
        console.log("🔄 Refreshing Dashboard Data...");
        await fetchTotalBalance();
        await fetchExpensesThisMonth();
    }, [fetchTotalBalance, fetchExpensesThisMonth]);

    // Fetch all dashboard data on mount
    useEffect(() => {
        fetchTotalBalance();
        fetchIncomeThisMonth();
        fetchExpensesThisMonth();
        fetchNetSavings();
        fetchMonthlyData();
        fetchBudgetAllocation();
        fetchTransactions();
        fetchMonthlyExpenses();
        fetchExpenseBreakdown();
    }, [
        fetchTotalBalance,
        fetchIncomeThisMonth,
        fetchExpensesThisMonth,
        fetchNetSavings,
        fetchMonthlyData,
        fetchBudgetAllocation,
        fetchTransactions,
        fetchMonthlyExpenses,
        fetchExpenseBreakdown
    ]);

    const formatCurrency = (amount) => {
        if (typeof amount !== "number" || isNaN(amount)) {
            return "0.00";
        }
        return `${amount.toLocaleString()}`;
    };

    return (
        <div className="dashboard">
            <h1 className="page-title">Dashboard</h1>

            {/* Row 1 - Summary Cards */}
            <div className="dashboard-widgets">
                <DashboardCard
                    title="Total Balance"
                    amount={formatCurrency(totalBalance)}
                    percentage={percentageChange}
                    previousBalance={formatCurrency(previousBalance)}
                    icon="/icons/balance.png"
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
            </div>

            {/* Row 2 - Chart Cards */}
            <div className="dashboard-charts">
                <div className="chart-card">
                    <h2>Monthly Income vs Expenses</h2>
                    <div className="chart-container">
                        <MonthlyIncomeExpensesChart data={monthlyData} />
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
                <div className="chart-card">
                    <h2>Savings Goals Progress</h2>
                    <GoalsProgressChart updateDashboardData={updateDashboardData} />
                </div>
                <div className="cashflow-chart-card">
                    {/* <h2>Cash Flow Chart</h2> */}
                    <CashFlowChart data={monthlyExpenses} />
                </div>
                {/* <div className="chart-card">
                    <h2>Expense Breakdown</h2>
                    <p>Placeholder for breakdown</p>
                </div> */}
                <div className="chart-card">
                    {/* <h2>Expense Breakdown</h2> */}
                    <ExpenseBreakdownChart data={expenseBreakdown} totalExpenses={totalExpenses} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
