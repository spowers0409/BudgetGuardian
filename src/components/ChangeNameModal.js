import React, { useState } from "react";
import "../styles/Profile.css";

const ChangeNameModal = ({ isOpen, onClose, currentName, onNameChange }) => {
    const [newName, setNewName] = useState(currentName || "");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async () => {
        if (!newName.trim()) {
            alert("Name cannot be empty.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://budgetguardian-backend.onrender.com/api/user/update-name", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ full_name: newName }),
                // body: JSON.stringify({ newName: newName }),
            });

            if (response.ok) {
                setSuccessMessage("Name Changed Successfully!");
                setTimeout(() => {
                    setSuccessMessage("");
                    onNameChange(newName);
                    onClose();
                }, 1500);
            } else {
                alert("Error updating name. Please try again.");
            }
        } catch (error) {
            console.error("Error updating name:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Change Name</h2>
                {successMessage ? (
                    <p className="success-message">{successMessage}</p>
                ) : (
                    <>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
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

export default ChangeNameModal;
