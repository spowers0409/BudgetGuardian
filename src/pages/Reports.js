import React, { useState } from "react";
import "../styles/Reports.css";

const Reports = () => {
    const [timePeriod, setTimePeriod] = useState("current_month");
    const [fileFormat, setFileFormat] = useState("pdf");

    const handleGenerateReport = () => {
        console.log("Generating report for:", timePeriod, "Format:", fileFormat);
        // This function will later send the request to the backend
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
