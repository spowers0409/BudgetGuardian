const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection

// Get total balance and percentage change
router.get("/total-balance", async (req, res) => {
    try {
        // Disable caching
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");

        // Fetch income and expenses
        const totalIncomeResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE type = 'income'`
        );
        const totalExpensesResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM transactions WHERE type != 'income'`
        );

        const totalIncome = parseFloat(totalIncomeResult.rows[0].total_income);
        const totalExpenses = parseFloat(totalExpensesResult.rows[0].total_expenses);
        const totalBalance = totalIncome - totalExpenses;

        // Fetch previous month's balance
        const previousBalanceResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS previous_balance 
            FROM transactions 
            WHERE transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
            AND transaction_date < date_trunc('month', CURRENT_DATE)
        `);
        const previousBalance = parseFloat(previousBalanceResult.rows[0].previous_balance);

        // Calculate percentage change
        const percentageChange = previousBalance !== 0
            ? ((totalBalance - previousBalance) / Math.abs(previousBalance)) * 100
            : 0;

        // Send fresh JSON response
        res.json({
            totalIncome,
            totalExpenses,
            totalBalance,
            previousBalance,
            percentageChange,
        });
    } catch (error) {
        console.error("Error fetching total balance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
