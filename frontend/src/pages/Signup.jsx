import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api"; // use your api.js
import "../styles/signup.css";
import Logo from "../images/Logo.png";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const showError = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const showSuccess = (msg) => {
    setMessage(msg);
    setMessageType("success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !email || !password || !confirmPassword || !department || !year) {
      showError("Please fill in all fields.");
      return;
    }

    if (!email.endsWith("@aau.edu.et")) {
      showError("Please use a valid AAU email address.");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data } = await signupUser({
        username,
        email,
        password,
        confirmPassword,
        department,
        year
      });

      // Signup successful
      showSuccess("Account created successfully!");

      // Store token if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Optionally store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      console.error(err);
      // Backend returns { error: "..." } on failure
      showError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="modal">
        <button className="close">
          <Link to="/" className="close-link">
            <svg className="close-sign" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </Link>
        </button>

        <div className="brand">
          <img src={Logo} alt="CollabStudy Logo" className="logo" />
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Join the CollabStudy community</p>
        </div>

        <form className="reg-form" autoComplete="off" onSubmit={handleSubmit}>
          <label className="labels">
            Username
            <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>

          <label className="labels">
            AAU Email
            <input type="email" placeholder="name.ugr-xxxx-xx@aau.edu.et" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="labels">
            Password
            <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <label className="labels">
            Confirm Password
            <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>

          <label className="labels">
            Major or Department
            <input type="text" placeholder="e.g., Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </label>

          <label className="labels">
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="">Select your year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </label>

          {message && <p className={`form-message ${messageType}`}>{message}</p>}

          <button type="submit" className="create" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="or-line">
          <span>or</span>
        </div>

        <p className="loginpage_foot">
          Already have an account? <Link to="/login" className="login-link">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
