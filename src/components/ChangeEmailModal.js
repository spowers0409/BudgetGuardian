import React, { useState } from "react";
import "../styles/Profile.css";

const ChangeEmailModal = ({ isOpen, onClose, currentEmail, onEmailChange }) => {
    const [newEmail, setNewEmail] = useState(currentEmail || "");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async () => {
        if (!newEmail.trim() || !newEmail.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://budgetguardian-backend.onrender.com/api/user/update-email", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ email: newEmail }),
            });

            if (response.ok) {
                setSuccessMessage("Email Changed Successfully!");
                setTimeout(() => {
                    setSuccessMessage("");
                    onEmailChange(newEmail);
                    onClose();
                }, 1500);
            } else {
                alert("Error updating email. Please try again.");
            }
        } catch (error) {
            console.error("Error updating email:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Change Email</h2>
                {successMessage ? (
                    <p className="success-message">{successMessage}</p>
                ) : (
                    <>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email"
                            className="modal-input"
                        />
                        <button className="modal-submit-btn" onClick={handleSubmit}>Submit</button>
                        <button className="modal-close-btn" onClick={onClose}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangeEmailModal;
