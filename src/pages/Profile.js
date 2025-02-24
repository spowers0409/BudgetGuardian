import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

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
        const token = localStorage.getItem("token"); // Ensure token is retrieved
        console.log("Fetching user data with token:", token);

        const response = await fetch("http://localhost:5000/api/user", {  // Ensure correct URL
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
        </div>
    );
};

export default Profile;



// import React, { useState } from "react";
// import "../styles/Profile.css";

// const Profile = () => {
//   const [name, setName] = useState("Test Tester");
//   const [email, setEmail] = useState("test@tester.com");

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <h2>Profile</h2>

//         <div className="profile-item">
//           <label>Name:</label>
//           <span>{name}</span>
//           <button className="profile-button">Change Name</button>
//         </div>

//         <div className="profile-item">
//           <label>Email:</label>
//           <span>{email}</span>
//           <button className="profile-button">Change Email</button>
//         </div>

//         <div className="profile-item-password">
//           <button className="profile-button change-password">Change Password</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
