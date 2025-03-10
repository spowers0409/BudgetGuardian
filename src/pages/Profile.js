import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import ChangeNameModal from "../components/ChangeNameModal"
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePasswordModal";



const Profile = () => {
    const [user, setUser] = useState({ name: "", email: "" });
    const [showNameModal, setShowNameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

  const fetchUserData = async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("Fetching user data with token:", token);

        // const response = await fetch("http://localhost:5000/api/user", {  // Ensure correct URL
        const response = await fetch("https://budgetguardian-backend.onrender.com/api/user", { // Render URL
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
        });

        console.log("Response Status:", response.status);  // Log status code

        const textResponse = await response.text();
        console.log("Raw Response:", textResponse);

        // Ensure response is OK before parsing
        if (!response.ok) {
            console.error("Server responded with an error:", response.status);
            return;
        }

        try {
            const data = JSON.parse(textResponse);
            console.log("Parsed User Data:", data);

            if (data.full_name && data.email) {
                setUser({ name: data.full_name, email: data.email });
            } else {
                console.error("Invalid user data received:", data);
            }
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};
  
const handleUpdateName = (newName) => {
    setUser((prev) => ({...prev, name: newName }));
};

  

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile</h2>
                
                <div className="profile-item">
                    <label>Name:</label>
                    <span>{user.name || "Loading..."}</span>
                    <button className="profile-button" onClick={() => setShowNameModal(true)}>
                        Change Name
                    </button>
                </div>
                
                <div className="profile-item">
                    <label>Email:</label>
                    <span>{user.email || "Loading..."}</span>
                    <button className="profile-button" onClick={() => setShowEmailModal(true)}>
                        Change Email
                    </button>
                </div>
                
                <div className="profile-item-password">
                    <button className="profile-button change-password" onClick={() => setShowPasswordModal(true)}>
                        Change Password
                    </button>
                </div>
            </div>
            {showNameModal && (
                <ChangeNameModal
                    isOpen={showNameModal}
                    onClose={() => setShowNameModal(false)}
                    currentName={user.name}
                    onNameChange={(updatedName) => setUser({ ...user, name: updatedName })}
                    />
            )}
            {showEmailModal && (
                <ChangeEmailModal
                    isOpen={showEmailModal}
                    onClose={() => setShowEmailModal(false)}
                    currentEmail={user.email}
                    onEmailChange={(updatedEmail) => setUser({ ...user, email: updatedEmail })}
                />
            )}
            {showPasswordModal && (
                <ChangePasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
        
    );
};

export default Profile;
