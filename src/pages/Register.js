import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match before sending request
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const userData = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
    };

    console.log("Sending registration request:", userData);

    try {
      // const response = await fetch("http://localhost:5000/auth/register", {
        const response = await fetch("https://budgetguardian-backend.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Create an Account</h1>
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">Submit</button>

          <div className="login-link">
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
