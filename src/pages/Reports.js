import React, { useState } from "react";
import "../styles/Reports.css";

const Reports = () => {
    const [timePeriod, setTimePeriod] = useState("current_month");
    const [fileFormat, setFileFormat] = useState("pdf");

    const handleGenerateReport = async () => {
        const requestUrl = `https://budgetguardian-backend.onrender.com/api/reports/export?format=${fileFormat}&period=${timePeriod}`;
        console.log("Requesting report from:", requestUrl);
    
        try {
            // const response = await fetch(requestUrl, { method: "GET" });
            const API_BASE_URL =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:10000"
                    : "https://budgetguardian-backend.onrender.com";

            const response = await fetch(
                `${API_BASE_URL}/api/reports/export?format=${fileFormat}&period=${timePeriod}`,
                { method: "GET" }
            );

    
            if (!response.ok) {
                throw new Error(`Failed to generate report. Status: ${response.status}`);
            }
    
            // Get the file name from response headers
            const contentDisposition = response.headers.get("Content-Disposition");
            const fileName = contentDisposition ? contentDisposition.split("filename=")[1] : `report.${fileFormat}`;
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
    
            console.log(`Report downloaded: ${fileName}`);
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    return (
        <div className="reports-container">
            <div className="reports-card">
                <h2>Generate Report</h2>

                <div className="reports-section">
                    <label>📅 Select Time Period:</label>
                    <select 
                        value={timePeriod} 
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="reports-dropdown"
                    >
                        <option value="current_month">Current Month</option>
                        <option value="previous_month">Previous Month</option>
                        <option value="last_6_months">Last 6 Months</option>
                        <option value="last_full_year">Last Full Year</option>
                        <option value="current_year">Current Year</option>
                    </select>
                </div>

                <div className="reports-section">
                    <label>📄 Export Format:</label>
                    <div className="reports-options">
                        <label>
                            <input 
                                type="radio" 
                                name="fileFormat" 
                                value="pdf" 
                                checked={fileFormat === "pdf"} 
                                onChange={() => setFileFormat("pdf")}
                            />
                            PDF
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="fileFormat" 
                                value="csv" 
                                checked={fileFormat === "csv"} 
                                onChange={() => setFileFormat("csv")}
                            />
                            CSV
                        </label>
                    </div>
                </div>

                <button className="reports-btn" onClick={handleGenerateReport}>
                    📊 Generate Report
                </button>
            </div>
        </div>
    );
};

export default Reports;
