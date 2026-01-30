
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css"; 
import Logo from "../images/Logo.png"; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }
    if (!email.endsWith("@aau.edu.et")) {
      setMessage("Please use a valid AAU email address.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful!");
        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setMessage(data.message || "Login failed.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-content">
      <article className="login-card" role="region" aria-label="login form">

        <Link to="/" className="close-btn" aria-label="Close">
          <svg
            className="close-sign"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </Link>

        <div className="logo-wrap" aria-hidden="true">
          <img className="logo-circle" src={Logo} alt="CollabStudy Logo" />
        </div>

        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Log in to continue your study journey</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">AAU Email</label>
            <div className="input-inner">
              <svg className="icon icon-mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name.ugr-xxxx-xx@aau.edu.et"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

Praise, [1/31/2026 1:34 AM]
<div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-inner">
              <svg className="icon icon-lock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <p className={`form-message ${messageType}`}>{message}</p>
          )}

          <div className="login">
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="forgot">Forgot password?</p>

          <div className="divider"><span>or</span></div>

          <p className="signup-line">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </form>
      </article>
    </main>
  );
}

export default Login;
