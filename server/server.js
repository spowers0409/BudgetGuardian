require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const pool = require("./db");

const app = express();

const corsOptions = {
    // origin: "http://localhost:3000",
    origin: ["http://localhost:3000", "https://budgetguardian.vercel.app"], // Added Vercel
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
})

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Register User
app.post("/auth/register", async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        console.log("Incoming Registration Request:", req.body);

        // Ensure email uniqueness
        const userExists = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email.toLowerCase()]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Insert user with plain text password (for MVP)
        const result = await pool.query(
            `INSERT INTO "user" (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING userID, full_name, email`,
            [full_name, email.toLowerCase(), password]
        );

        console.log("User Registered Successfully:", result.rows[0]);
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Login User
app.post("/auth/login", async (req, res) => {
    try {
        console.log("Received login request:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        // Find the user
        const userQuery = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email.toLowerCase()]);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare plain text password
        if (password !== userQuery.rows[0].password_hash) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userID: userQuery.rows[0].userid }, 
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1h" }
        );
        

        console.log("Login successful for user:", email);
        res.json({ token });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all transactions - sorted by most recent date first
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

        console.log("Adding budget category:", category, "Budgeted:", budgeted);

        const newBudget = await pool.query(
            `INSERT INTO budget (category, budgeted)
             VALUES ($1, $2)
             ON CONFLICT (category) 
             DO UPDATE SET budgeted = EXCLUDED.budgeted 
             RETURNING *`,
            [category, budgeted]
        );

        console.log("New Budget Added:", newBudget.rows[0]);
        res.json(newBudget.rows[0] || { message: "No data inserted" });
    } catch (err) {
        console.error("Error adding budget:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Middleware to verify JWT and extract user ID
const authenticateUser = (req, res, next) => {
    // const token = req.header("Authorization")?.split(" ")[1];
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

// **Get logged-in user details**
app.get("/api/user", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userID;

        const userQuery = await pool.query(
            `SELECT userID, full_name, email FROM "user" WHERE userID = $1`,
            [userId]
        );

        if (userQuery.rows.length === 0) {
            console.log("User not found for ID:", userId);
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userQuery.rows[0];
        console.log("User Data Response:", userData);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Updating logged in user name from name change modal
app.put("/api/user/update-name", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userID;
        const { newName } = req.body;

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ error: "New name cannot be empty." });
        }

        // Update the user's name in the database
        const result = await pool.query(
            `UPDATE "user" SET full_name = $1 WHERE userID = $2 RETURNING full_name`,
            [newName, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log("Name updated successfully:", result.rows[0].full_name);
        res.json({ message: "Name updated successfully", full_name: result.rows[0].full_name });

    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ error: "Server error" });
    }
});


const PORT = process.env.PORT || 10000; // Previously 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
