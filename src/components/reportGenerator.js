const { Pool } = require("pg");
const { parse } = require("json2csv");
const PDFDocument = require("pdfkit")

// Connect to Database
const connectionString =
    process.env.NODE_ENV === "production"
        ? process.env.RENDER_DATABASE_URL
        : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

console.log("Connecting to DB:", process.env.NODE_ENV === "production" ? "Using Render DB" : "Using Local DB");



const getTransactions = async (period) => {
    let query = `SELECT * FROM transaction WHERE transaction_date >= NOW() - INTERVAL '1 month'`;

    if (period === "previous_month") {
        query = `SELECT * FROM transaction WHERE transaction_date >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') 
                 AND transaction_date < DATE_TRUNC('month', NOW())`;
    } else if (period === "last_6_months") {
        query = `SELECT * FROM transaction WHERE transaction_date >= NOW() - INTERVAL '6 months'`;
    } else if (period === "last_full_year") {
        query = `SELECT * FROM transaction WHERE transaction_date >= DATE_TRUNC('year', NOW() - INTERVAL '1 year') 
                 AND transaction_date < DATE_TRUNC('year', NOW())`;
    } else if (period === "current_year") {
        query = `SELECT * FROM transaction WHERE transaction_date >= DATE_TRUNC('year', NOW())`;
    }

    const result = await pool.query(query);
    return result.rows;

    // console.log(`Running Query for '${period}': ${query}`); // Debug log

    // try {
    //     const result = await pool.query(query);
    //     console.log(`Retrieved ${result.rows.length} transactions`);
    //     return result.rows;
    // } catch (error) {
    //     console.error("Database Query Error:", error.stack);
    //     throw error; // Ensure the error is thrown so we can see it in the response
    // }
};

const generateCSV = async (period) => {
    const transactions = await getTransactions(period);
    const fields = ["transaction_date", "amount", "category", "place", "type"];
    return parse(transactions, { fields });
};

const generatePDF = async (period) => {

    const transactions = await getTransactions(period);

    const doc = new PDFDocument();
    let buffers = [];

    // Log when data is being written
    doc.on("data", (chunk) => {
        buffers.push(chunk);
    });

    doc.fontSize(16).text("Budget Report", { align: "center" }).moveDown();

    transactions.forEach((txn, index) => {
        const txnType = txn.type ? txn.type.toUpperCase() : "UNKNOWN";

        doc
            .fontSize(12)
            .text(
                `${txn.transaction_date}: ${txnType} - $${txn.amount} (${txn.category})`
            );
    });

    doc.end();

    return new Promise((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)));
    });
};

module.exports = { generateCSV, generatePDF };