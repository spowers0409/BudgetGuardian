require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Get all transactions - sorted by most recent date first)
app.get("/api/transactions", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM transaction ORDER BY transaction_date DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching transactions:", err.message);
        res.status(500).send("Server Error");
    }
});

// Add a new transaction
app.post("/api/transactions", async (req, res) => {
    try {
        const { transaction_date, category, place, amount } = req.body;
        const newTransaction = await pool.query(
            "INSERT INTO transaction (transaction_date, category, place, amount) VALUES ($1, $2, $3, $4) RETURNING *",
            [transaction_date, category, place, amount]
        );
        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error("Error adding transaction:", err.message);
        res.status(500).send("Server Error");
    }
});

// Get all unique budget categories for transactions
app.get("/api/budget-categories", async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT category FROM budget");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching budget categories:", err.message);
        res.status(500).send("Server Error");
    }
});

// Get all budgets
app.get("/api/budgets", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM budget");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching budgets:", err.message);
        res.status(500).send("Server Error");
    }
});

// Add a new budget category
app.post("/api/budgets", async (req, res) => {
    try {
        const { category, budgeted } = req.body;

        // DEBUG LOGGING
        console.log("Adding budget category:", category, "Budgeted:", budgeted);

        const newBudget = await pool.query(
            `INSERT INTO budget (category, budgeted)
             VALUES ($1, $2)
             ON CONFLICT (category) 
             DO UPDATE SET budgeted = EXCLUDED.budgeted 
             RETURNING *`,
            [category, budgeted]
        );

        // DEBUG LOGGING
        console.log("New Budget Added:", newBudget.rows[0]);

        res.json(newBudget.rows[0] || { message: "No data inserted" });
    } catch (err) {
        console.error("Error adding budget:", err.message);
        res.status(500).json({ error: err.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
