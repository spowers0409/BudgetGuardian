const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// **Register User**
router.post("/register", async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        console.log("Incoming Registration Request:", req.body);

        // Check if user already exists
        const userExists = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email.toLowerCase()]);
        console.log("User Exists Query Result:", userExists.rows);

        if (userExists.rows.length > 0) {
            console.log("User already exists:", email);
            return res.status(400).json({ error: "Email is already registered." });
        }

        // **Ensure password is hashed**
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated Hashed Password:", hashedPassword);

        console.log(`Executing SQL: INSERT INTO "user" (full_name, email, password_hash) VALUES ($1, $2, $3)`);

        // Insert into database
        const result = await pool.query(
            `INSERT INTO "user" (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING userID, full_name, email`,
            [full_name, email.toLowerCase(), hashedPassword]
        );

        console.log("User Registered Successfully:", result.rows[0]);

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        console.log("Received login request:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ error: "Missing email or password" });
        }

        console.log(`Executing query: SELECT * FROM "user" WHERE email = '${email.toLowerCase()}'`);

        const userQuery = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email.toLowerCase()]);
        console.log("User Query Result:", userQuery.rows);

        if (userQuery.rows.length === 0) {
            console.log("User not found for email:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // **Check if the password is correct using bcrypt.compare()**
        const validPassword = await bcrypt.compare(password, userQuery.rows[0].password_hash);
        console.log("Password comparison result:", validPassword);

        if (!validPassword) {
            console.log("Incorrect password for user:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userID: userQuery.rows[0].userid }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login successful for user:", email);
        res.json({ token });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
