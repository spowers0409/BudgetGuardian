const express = require("express");
const router = express.Router();
// const db = require("./db"); // Database connection
const pool = require("./db")

// Get total balance and percentage change
router.get("/total-balance", async (req, res) => {
    try {
        console.log("🔍 Fetching total balance...");
        // Disable caching
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        // Fetch income and expenses
        const totalIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS total_income
            FROM transaction
            WHERE "type" = 'income';
        `);
        console.log("Total Income Query Result:", totalIncomeResult.rows);

        const totalExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS total_expenses
            FROM transaction
            WHERE "type" != 'income';
        `);
        console.log("Total Expenses Query Result:", totalExpensesResult.rows);

        const totalIncome = parseFloat(totalIncomeResult.rows[0]?.total_income || 0);
        const totalExpenses = parseFloat(totalExpensesResult.rows[0]?.total_expenses || 0);
        const totalBalance = totalIncome - totalExpenses;
        console.log("Calculated Total Balance:", totalBalance);

        // Fetch previous month's balance
        // const previousBalanceResult = await pool.query(`
        //     SELECT COALESCE(SUM(amount), 0) AS previous_balance 
        //     FROM transaction 
        //     WHERE transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
        //     AND transaction_date < date_trunc('month', CURRENT_DATE)
        // `);
        // const previousBalance = parseFloat(previousBalanceResult.rows[0].previous_balance);
        const previousIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_income
            FROM transaction
            WHERE "type" = 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);
        const previousExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_expenses
            FROM transaction
            WHERE "type" != 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);

        const prevIncome = parseFloat(previousIncomeResult.rows[0]?.previous_income || 0);
        const prevExpenses = parseFloat(previousExpensesResult.rows[0]?.previous_expenses || 0);
        const previousBalance = prevIncome - prevExpenses;

        // const previousBalance = parseFloat(previousIncomeResult.rows[0].previous_income) - parseFloat(previousExpensesResult.rows[0].previous_expenses);
        

        // Calculate percentage change
        const percentageChange = previousBalance !== 0
            ? ((totalBalance - previousBalance) / Math.abs(previousBalance)) * 100
            : 0;


        console.log("API Response Data:", {
            totalIncome,
            totalExpenses,
            totalBalance,
            previousBalance,
            percentageChange,
        });
            
        // Send fresh JSON response
        // res.setHeader("Content-Type", "application/json");
        // res.status(200).json({
        res.json({
            totalIncome,
            totalExpenses,
            totalBalance,
            previousBalance,
            percentageChange,
        });
    } catch (error) {
        console.error("Error fetching total balance:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/income-this-month", async (req, res) => {
    try {
        console.log("🔍 Fetching income for the current and previous month...");

        // Get income for the current month
        const currentIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS current_income
            FROM transaction
            WHERE "type" = 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE)
            AND transaction_date < date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
        `);
        const currentIncome = parseFloat(currentIncomeResult.rows[0]?.current_income || 0);

        // Get income for the previous month
        const previousIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_income
            FROM transaction
            WHERE "type" = 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);
        const previousIncome = parseFloat(previousIncomeResult.rows[0]?.previous_income || 0);

        // Calculate percentage change
        const percentageChange = previousIncome !== 0
            ? ((currentIncome - previousIncome) / Math.abs(previousIncome)) * 100
            : currentIncome > 0 ? 100 : 0;

        console.log("Income This Month API Response:", {
            currentIncome,
            previousIncome,
            percentageChange
        });

        res.json({
            currentIncome,
            previousIncome,
            percentageChange
        });

    } catch (error) {
        console.error("Error fetching income this month:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/expenses-this-month", async (req, res) => {
    console.log("dashboardRoutes.js is being loaded");

    try {
        console.log("Fetching expenses for the current and previous month...");

        // Get expenses for the current month
        const currentExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS current_expenses
            FROM transaction
            WHERE "type" = 'expense'
            AND transaction_date >= date_trunc('month', CURRENT_DATE)
            AND transaction_date < date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
        `);
        const currentExpenses = parseFloat(currentExpensesResult.rows[0]?.current_expenses || 0);

        // Get expenses for the previous month
        const previousExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_expenses
            FROM transaction
            WHERE "type" = 'expense'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);
        const previousExpenses = parseFloat(previousExpensesResult.rows[0]?.previous_expenses || 0);

        // Calculate percentage change
        const percentageChange = previousExpenses !== 0
            ? ((currentExpenses - previousExpenses) / Math.abs(previousExpenses)) * 100
            : currentExpenses > 0 ? 100 : 0;

        console.log("Expenses This Month API Response:", {
            currentExpenses,
            previousExpenses,
            percentageChange
        });

        res.json({
            currentExpenses,
            previousExpenses,
            percentageChange
        });

    } catch (error) {
        console.error("Error fetching expenses this month:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/net-savings", async (req, res) => {
    try {
        console.log("Fetching net savings for the current and previous month...");

        // Get current month's income
        const currentIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS current_income
            FROM transaction
            WHERE "type" = 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE)
            AND transaction_date < date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
        `);
        const currentIncome = parseFloat(currentIncomeResult.rows[0]?.current_income || 0);

        // Get current month's expenses
        const currentExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS current_expenses
            FROM transaction
            WHERE "type" = 'expense'
            AND transaction_date >= date_trunc('month', CURRENT_DATE)
            AND transaction_date < date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
        `);
        const currentExpenses = parseFloat(currentExpensesResult.rows[0]?.current_expenses || 0);

        // Calculate Net Savings for the current month
        const currentNetSavings = currentIncome - currentExpenses;

        // Get last month's income
        const previousIncomeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_income
            FROM transaction
            WHERE "type" = 'income'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);
        const previousIncome = parseFloat(previousIncomeResult.rows[0]?.previous_income || 0);

        // Get last month's expenses
        const previousExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_expenses
            FROM transaction
            WHERE "type" = 'expense'
            AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND transaction_date < date_trunc('month', CURRENT_DATE);
        `);
        const previousExpenses = parseFloat(previousExpensesResult.rows[0]?.previous_expenses || 0);

        // Calculate Net Savings for the previous month
        const previousNetSavings = previousIncome - previousExpenses;

        // Calculate percentage change
        const percentageChange = previousNetSavings !== 0
            ? ((currentNetSavings - previousNetSavings) / Math.abs(previousNetSavings)) * 100
            : currentNetSavings > 0 ? 100 : 0;

        console.log("Net Savings API Response:", {
            currentNetSavings,
            previousNetSavings,
            percentageChange
        });

        res.json({
            currentNetSavings,
            previousNetSavings,
            percentageChange
        });

    } catch (error) {
        console.error("Error fetching net savings:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/monthly-income-expenses", async (req, res) => {
    try {
        console.log("Fetching monthly income and expenses for the current year...");

        const monthlyDataResult = await pool.query(`
            SELECT 
                TO_CHAR(date_trunc('month', transaction_date), 'Month') AS month,
                EXTRACT(MONTH FROM transaction_date) AS month_number,
                SUM(CASE WHEN "type" = 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN "type" = 'expense' THEN amount ELSE 0 END) AS expenses
            FROM transaction
            WHERE transaction_date >= date_trunc('year', CURRENT_DATE)  -- Only fetch current year
            AND transaction_date < date_trunc('year', CURRENT_DATE + INTERVAL '1 year')
            GROUP BY month, month_number
            ORDER BY month_number;
        `);

        let monthlyData = monthlyDataResult.rows.map(row => ({
            month: row.month.trim(),
            income: parseFloat(row.income) || 0,
            expenses: parseFloat(row.expenses) || 0
        }));

        // Ensure all months appear even if no transactions exist
        const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        monthlyData = allMonths.map((month) => {
            const existingMonth = monthlyData.find((m) => m.month === month);
            return existingMonth || { month, income: 0, expenses: 0 };
        });

        console.log("Final API Response:", monthlyData);
        res.json(monthlyData);

    } catch (error) {
        console.error("Error fetching monthly income & expenses:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get("/budget-allocation", async (req, res) => {
    try {
        console.log("🔍 Fetching budget allocation data...");

        const budgetDataResult = await pool.query(`
            SELECT 
                b.category, 
                b.budgeted, 
                COALESCE(SUM(t.amount), 0) AS spent
            FROM budget b
            LEFT JOIN transaction t 
                ON LOWER(b.category) = LOWER(t.category) AND t.type = 'expense'
            WHERE LOWER(b.category) != 'income'  -- Exclude Income
            GROUP BY b.category, b.budgeted
            ORDER BY b.category ASC;
        `);

        const budgetData = budgetDataResult.rows.map(row => ({
            category: row.category,
            budgeted: parseFloat(row.budgeted) || 0,
            spent: parseFloat(row.spent) || 0
        }));

        console.log("Fixed Budget Allocation API Response:", budgetData);
        res.json(budgetData);
    } catch (error) {
        console.error("Error fetching budget allocation:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});







router.get("/debug-database", async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database();");
        res.json({ database_name: result.rows[0].current_database });
    } catch (error) {
        res.status(500).json({ error: "Error fetching database name", details: error.message });
    }
});






module.exports = router;
