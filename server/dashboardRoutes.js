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
        console.log("✅ Total Income Query Result:", totalIncomeResult.rows);

        const totalExpensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS total_expenses
            FROM transaction
            WHERE "type" != 'income';
        `);
        console.log("✅ Total Expenses Query Result:", totalExpensesResult.rows);

        const totalIncome = parseFloat(totalIncomeResult.rows[0]?.total_income || 0);
        const totalExpenses = parseFloat(totalExpensesResult.rows[0]?.total_expenses || 0);
        const totalBalance = totalIncome - totalExpenses;
        console.log("📊 Calculated Total Balance:", totalBalance);

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


        console.log("✅ API Response Data:", {
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

        console.log("✅ Income This Month API Response:", {
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



module.exports = router;
