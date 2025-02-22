import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Make sure this file exists

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Registered:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Create an Account</h1>
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="register-btn">Submit</button>

          <div className="login-link">

            <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
            
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Register;
