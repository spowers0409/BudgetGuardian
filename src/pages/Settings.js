import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = ({ darkMode, setDarkMode }) => {
    const [currency, setCurrency] = useState('USD');
    const [emailNotifications, setEmailNotifications] = useState(true);

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    return (
        <div className="settings-container">
            <div className="settings-card">
                <h2>Settings</h2>
                
                <div className="setting-item">
                    <label>Preferred Currency: </label>
                    <select value={currency} onChange={handleCurrencyChange}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                    </select>
                </div>

                {/* <div className="setting-item">
                    <label>Dark Mode:</label>
                    <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={() => {
                            setDarkMode(!darkMode);
                            localStorage.setItem('darkMode', !darkMode);
                        }} 
                    />
                </div> */}

                <div className="setting-item">
                    <label>Email Notifications:</label>
                    <input 
                        type="checkbox" 
                        checked={emailNotifications} 
                        onChange={() => setEmailNotifications(!emailNotifications)} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
