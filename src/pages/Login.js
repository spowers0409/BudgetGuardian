import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Placeholder authentication check
    if (email === "test@example.com" && password === "password123") {
      navigate("/dashboard"); // Redirect to Dashboard on successful login
    } else {
      setError("Invalid email or password.");
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

          {/* <button type="submit" className="login-btn">Login</button> */}
          <div className="button-container">
              <button type="submit" className="login-btn">Login</button>
          </div>

          {/* <div className="register-link">
            <p>Don't have an account?{" "}
              <span className="register-btn" onClick={() => navigate("/register")}>Register</span>
            </p>
          </div> */}

          <div className="register-link">
            <p>Don't have an account? <span onClick={ () => navigate("/register") }>Register</span></p>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
