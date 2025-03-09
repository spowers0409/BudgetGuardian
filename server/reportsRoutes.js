const express = require("express");
const path = require("path");

console.log("Initializing Reports Router...");  // Debug log

const router = express.Router();
const { generateCSV, generatePDF } = require(path.join(__dirname, "../src/components/reportGenerator"));

router.get("/", (req, res) => {
    console.log("/api/reports was accessed!");
    res.json({ message: "Reports route is working!" });
});

router.get("/export", async (req, res) => {
    console.log("/api/reports/export route has been hit!");  // Debug log

    try {
        const { format, period } = req.query;
        if (!format || !period) {
            return res.status(400).json({ error: "Missing required selections." });
        }

        let fileBuffer;
        let fileName;
        if (format === "csv") {
            fileBuffer = await generateCSV(period);
            fileName = "budget_report.csv";
            res.setHeader("Content-Type", "text/csv");
        } else if (format === "pdf") {
            fileBuffer = await generatePDF(period);
            fileName = "budget_report.pdf";
            res.setHeader("Content-Type", "application/pdf");
        } else {
            return res.status(400).json({ error: "Invalid format" });
        }

        console.log(`Successfully generated ${fileName}`);
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        res.send(fileBuffer);
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: error.message });
    }
});

console.log("/api/reports/export route should now be available");

router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`Reports Route Registered: ${r.route.path}`);
    }
});

module.exports = router;
