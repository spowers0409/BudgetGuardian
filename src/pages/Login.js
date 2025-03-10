import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log("Sending data:", { email, password });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch("http://localhost:5000/auth/login", {
        const response = await fetch("https://budgetguardian-backend.onrender.com/auth/login", { // Render URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid email or password.");
      }
      
      } catch (err) {
        console.log("Login failed:", err);
        setError("An error ocurred. Please try again.")
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to BudgetGuardian</h2>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-container">
              <button type="submit" className="login-btn">Login</button>
          </div>

          <div className="register-link">
            <p>Don't have an account? <span onClick={ () => navigate("/register") }>Register</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
