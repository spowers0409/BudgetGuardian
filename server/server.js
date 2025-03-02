require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const dashboardRoutes = require("./dashboardRoutes");


const app = express();

const corsOptions = {
    // origin: "http://localhost:3000",
    origin: ["http://localhost:3000", "https://budgetguardian.vercel.app"], // Added Vercel
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    exposedHeaders: ["Content-Length", "Content-Type"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*'); // Testing routes
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control");
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

app.use("/api/dashboard", dashboardRoutes);

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
// Add a new transaction
app.post("/api/transactions", async (req, res) => {
    try {
        const { transaction_date, category, place, amount, type } = req.body;

        console.log("📥 Incoming Transaction Data:", req.body); // Log what frontend is sending

        // Validate type (should be either 'income' or 'expense')
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: "Invalid transaction type. Must be 'income' or 'expense'." });
        }

        const newTransaction = await pool.query(
            "INSERT INTO transaction (transaction_date, category, place, amount, type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [transaction_date, category, place, amount, type]
        );

        console.log("✅ Transaction Saved in DB:", newTransaction.rows[0]); // Log what DB actually saves

        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error("❌ Error adding transaction:", err.message);
        res.status(500).send("Server Error");
    }
});






// Get all unique budget categories for transactions
// app.get("/api/budget-categories", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT category FROM budget");

//         let categories = result.rows.map((item) => item.category);

//         // Income is always included no matter what is added from budgets
//         if (!categories.includes("Income")) {
//             categories.unshift("Income");
//         }

//         res.json(categories); // Chhanged from result.rows to show Income
//     } catch (err) {
//         console.error("Error fetching budget categories:", err.message);
//         res.status(500).send("Server Error");
//     }
// });

app.get("/api/budget-categories", async (req, res) => {
    try {
        const result = await pool.query("SELECT category FROM budget");
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
        // const { newName } = req.body;
        const { full_name } = req.body;

        // if (!newName || newName.trim() === "") {
            if (!full_name || full_name.trim() === "") {
            return res.status(400).json({ error: "New name cannot be empty." });
        }

        // Update the user's name in the database
        const result = await pool.query(
            `UPDATE "user" SET full_name = $1 WHERE userID = $2 RETURNING full_name`,
            // [newName, userId]
            [full_name, userId]
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
app.put("/api/user/update-email", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userID;
        const { email } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Check if email already exists
        const emailCheck = await pool.query(
            `SELECT email FROM "user" WHERE email = $1`,
            [email]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // Update the email in the database
        const result = await pool.query(
            `UPDATE "user" SET email = $1 WHERE userID = $2 RETURNING email`,
            [email, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log("Email updated successfully:", result.rows[0].email);
        res.json({ message: "Email updated successfully", email: result.rows[0].email });

    } catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ error: "Server error" });
    }
});
app.put("/api/user/update-password", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userID;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Fetch user's current password from the database
        const userQuery = await pool.query(
            `SELECT password_hash FROM "user" WHERE userID = $1`,
            [userId]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const storedPassword = userQuery.rows[0].password_hash;

        // Compare entered current password with the stored password (PLAIN TEXT for MVP)
        if (current_password !== storedPassword) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        // Update the password in the database (PLAIN TEXT for MVP)
        const result = await pool.query(
            `UPDATE "user" SET password_hash = $1 WHERE userID = $2 RETURNING userID`,
            [new_password, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log("Password updated successfully for user:", userId);
        res.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const ensureIncomeBudget = async () => {
    try {
        await pool.query(
            `INSERT INTO budget (category, budgeted, spent)
             VALUES ('Income', 0, 0)
             ON CONFLICT (category) DO NOTHING;`
        );
        console.log("✅ 'Income' category ensured in budget table.");
    } catch (error) {
        console.error("Error ensuring 'Income' category:", error);
    }
};

ensureIncomeBudget();


const PORT = process.env.PORT || 10000; // Previously 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
