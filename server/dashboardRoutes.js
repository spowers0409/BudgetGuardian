const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection

// Get total balance and percentage change
router.get("/total-balance", async (req, res) => {
  try {
    // Get all time total income and expenses
    const totalIncomeQuery = `SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE type = 'income'`;
    const totalExpensesQuery = `SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM transactions WHERE type != 'income'`;
    
    const totalIncomeResult = await db.query(totalIncomeQuery);
    const totalExpensesResult = await db.query(totalExpensesQuery);
    
    const totalIncome = parseFloat(totalIncomeResult.rows[0].total_income);
    const totalExpenses = parseFloat(totalExpensesResult.rows[0].total_expenses);
    const totalBalance = totalIncome - totalExpenses;

    // Get last month's balance
    const previousMonthIncomeQuery = `
      SELECT COALESCE(SUM(amount), 0) AS prev_income 
      FROM transactions 
      WHERE type = 'income' AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    `;
    const previousMonthExpensesQuery = `
      SELECT COALESCE(SUM(amount), 0) AS prev_expenses 
      FROM transactions 
      WHERE type != 'income' AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    `;

    const prevIncomeResult = await db.query(previousMonthIncomeQuery);
    const prevExpensesResult = await db.query(previousMonthExpensesQuery);

    const previousIncome = parseFloat(prevIncomeResult.rows[0].prev_income);
    const previousExpenses = parseFloat(prevExpensesResult.rows[0].prev_expenses);
    const previousBalance = previousIncome - previousExpenses;

    // Calculate percentage change
    let percentageChange = previousBalance !== 0
      ? ((totalBalance - previousBalance) / previousBalance) * 100
      : null;
    
    res.json({
      totalIncome,
      totalExpenses,
      totalBalance,
      previousBalance,
      percentageChange
    });
  } catch (error) {
    console.error("Error fetching total balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
