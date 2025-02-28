import React, { useState } from "react";
import "../styles/Profile.css";
const ChangePasswordModal = ({ isOpen, onClose, onPasswordChange }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://budgetguardian-backend.onrender.com/api/user/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (response.ok) {
                setSuccessMessage("Password Changed Successfully!");
                setTimeout(() => {
                    setSuccessMessage("");
                    // onPasswordChange(); // May be causing the modal to not close
                    onClose();
                }, 1500);
            } else {
                alert("Error updating password. Please check your current password and try again.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Change Password</h2>
                {successMessage ? (
                    <p className="success-message">{successMessage}</p>
                ) : (
                    <>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            className="modal-input"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="modal-input"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
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

export default ChangePasswordModal;
