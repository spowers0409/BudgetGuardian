require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.DB_HOST.includes("localhost") ? false : { rejectUnauthorized: false },
    // ssl: {
    //     rejectUnauthorized: false, // Render Required
    // },
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL!"))
    .catch(err => console.error("Database connection error:", err));

module.exports = pool;
