const express = require("express");
const router = express.Router();
// const db = require("./db"); // Database connection
const pool = require("./db")

console.log("✅ dashboardRoutes.js has been loaded!");

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
            ? Math.round(((totalBalance - previousBalance) / Math.abs(previousBalance)) * 100)
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
            ? Math.round(((currentIncome - previousIncome) / Math.abs(previousIncome)) * 100)
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
            ? Math.round(((currentExpenses - previousExpenses) / Math.abs(previousExpenses)) * 100)
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

        // Fetch Net Savings for the Last 6 Months
        const pastSavingsResult = await pool.query(`
            SELECT 
                DATE_TRUNC('month', transaction_date) AS month, 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS netSavings
            FROM transaction
            WHERE transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '6 months')
            GROUP BY month
            ORDER BY month ASC;
        `);

        // Extract past savings values
        const pastSavings = pastSavingsResult.rows.map(row => parseFloat(row.netsavings));

        // Calculate percentage change
        const percentageChange = previousNetSavings !== 0
            ? Math.round(((currentNetSavings - previousNetSavings) / Math.abs(previousNetSavings)) * 100)
            : currentNetSavings > 0 ? 100 : 0;

        console.log("Net Savings API Response:", {
            currentNetSavings,
            previousNetSavings,
            percentageChange,
            pastSavings
        });

        res.json({
            currentNetSavings,
            previousNetSavings,
            percentageChange,
            pastSavings
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
            "Januar", "February", "March", "April", "May", "June",
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

router.get("/recent-transactions", async (req, res) => {
    try {
        console.log("🔍 Fetching recent transactions...");
        
        const transactionsResult = await pool.query(`
            SELECT transaction_date AS date, category, amount
            FROM transaction
            WHERE type = 'expense'
            AND transaction_date >= date_trunc('month', CURRENT_DATE)
            ORDER BY transaction_date DESC
        `);

        const recentTransactions = transactionsResult.rows.map(row => ({
            date: row.date,
            category: row.category,
            amount: parseFloat(row.amount)
        }));

        console.log("Recent Transactions API Response:", recentTransactions);
        res.json(recentTransactions);
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
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

// router.get("/goals", async (req, res) => {
//     try {
//         console.log("Fetching all goals...");
//         const result = await pool.query(`SELECT * FROM goal ORDER BY goal_id ASC;`);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Error fetching goals:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.get("/goals", async (req, res) => {
    try {
        console.log("Fetching all goals...");

        // Run the query
        const result = await pool.query(`SELECT * FROM goal ORDER BY goal_id ASC;`);

        console.log("Query Success! Result:", result.rows); // Log query output

        // Transform the result to match what the frontend expects
        const goals = result.rows.map(row => ({
            goal_id: row.goal_id,
            goal_name: row.goal_name,
            target_amount: parseFloat(row.goal_amount),
            saved_amount: parseFloat(row.saved_amount) || 0
        }));

        res.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error.stack); // Print full error stack
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});



// Router debug
// router.get("/goals", async (req, res) => {
//     try {
//         console.log("Testing basic SQL query...");
//         const result = await pool.query("SELECT NOW();");  // Simple query to test DB connection
//         console.log("Database response:", result.rows);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Error in test route:", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// });



router.post("/goals", async (req, res) => {
    try {
        console.log("Incoming POST Data:", req.body);

        const { name, goal_amount } = req.body;

        console.log("Name:", name);
        console.log("Goal Amount:", goal_amount, "Type:", typeof goal_amount);

        if (!name || isNaN(goal_amount)) {
            console.error("Invalid goal data received:", req.body);
            return res.status(400).json({ error: "Invalid goal data" });
        }

        const newGoal = await pool.query(
            `INSERT INTO goal (goal_name, goal_amount, saved_amount) 
             VALUES ($1, $2, 0) RETURNING *`,
            [name, goal_amount]
        );

        console.log("Goal Added:", newGoal.rows[0]);
        res.json(newGoal.rows[0]);  
    } catch (error) {
        console.error("Error adding goal:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




router.put("/goals/:id/add-savings", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!id || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Get current goal
        const goalQuery = await pool.query(`SELECT * FROM goal WHERE goal_id = $1`, [id]);
        if (goalQuery.rows.length === 0) {
            return res.status(404).json({ error: "Goal not found" });
        }

        // Update goal savings
        const updatedGoal = await pool.query(
            `UPDATE goal SET saved_amount = saved_amount + $1 WHERE goal_id = $2 RETURNING *`,
            [amount, id]
        );

        console.log("Goal Updated:", updatedGoal.rows[0]);

        // Deduct from Total Balance
        // await pool.query(
        //     `UPDATE transaction SET amount = amount - $1 WHERE type = 'income' RETURNING *`,
        //     [amount]
        // );

        // Add to Expenses This Month
        await pool.query(
            `INSERT INTO transaction (transaction_date, category, place, amount, type)
             VALUES (CURRENT_DATE, 'Savings', 'Goal Contribution', $1, 'expense')`,
            [amount]
        );

        res.json({ message: "Savings added successfully", goal: updatedGoal.rows[0] });
    } catch (error) {
        console.error("Error adding savings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add this new endpoint inside `dashboardRoutes.js`
router.get("/expenses/monthly", async (req, res) => {
    try {
        console.log("Fetching monthly expenses...");

        const result = await pool.query(`
            SELECT 
                months.month,
                COALESCE(SUM(t.amount), 0) AS total_expenses
            FROM (
                SELECT 
                    generate_series(1, 12) AS month
            ) AS months
            LEFT JOIN transaction t 
                ON EXTRACT(MONTH FROM t.transaction_date) = months.month
                AND EXTRACT(YEAR FROM t.transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND t.type = 'expense'
            GROUP BY months.month
            ORDER BY months.month;
        `);

        // Get the current year dynamically
        const currentYear = new Date().getFullYear();

        // Format response to include month names dynamically
        const formattedData = result.rows.map(row => ({
            month: new Date(currentYear, row.month - 1, 1).toLocaleString("default", { month: "short" }),
            total_expenses: parseFloat(row.total_expenses)
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching monthly expenses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/expense-breakdown", async (req, res) => {
    try {
        console.log("🔍 Fetching expense breakdown by category...");

        // Get current year and month dynamically
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based

        // Query to get total expenses by category for the current month
        const result = await pool.query(`
            SELECT category, COALESCE(SUM(amount), 0) AS total
            FROM transaction
            WHERE type = 'expense'
            AND EXTRACT(YEAR FROM transaction_date) = $1
            AND EXTRACT(MONTH FROM transaction_date) = $2
            GROUP BY category
            ORDER BY total DESC;
        `, [currentYear, currentMonth]);

        // Calculate total expenses
        const totalExpenses = result.rows.reduce((sum, row) => sum + parseFloat(row.total), 0);

        // Format response to include percentage calculations
        const formattedData = result.rows.map(row => ({
            category: row.category,
            total: parseFloat(row.total),
            percentage: totalExpenses > 0 ? ((parseFloat(row.total) / totalExpenses) * 100).toFixed(2) : 0
        }));

        console.log("Expense Breakdown API Response:", formattedData);
        res.json({ totalExpenses, breakdown: formattedData });

    } catch (error) {
        console.error("Error fetching expense breakdown:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});




router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`Loaded Dashboard Route: /api/dashboard${r.route.path}`);
    }
});


module.exports = router;
