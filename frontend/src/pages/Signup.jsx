import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/signup.css";
import Logo from "../images/Logo.png";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showError = (msg) => {
    setMessage(msg);
    setMessageType("error");
};

  const showSuccess = (msg) => {
    setMessage(msg);
    setMessageType("success");
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !department ||
    !year
  ) {
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

  const user = { username, email, password, department, year };
  localStorage.setItem("CollabStudyUser", JSON.stringify(user));

  showSuccess("Account created successfully!");
};

 
  return (
    <div className="page-bg">
        <div className="modal">
            <button className="close">
                <Link to="/" className="close-link">
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
            </button>
            <div className="brand">
                <img src={Logo} alt="CollabStudy Logo" className="logo" />
                <h1 className="title">Create Account</h1>
                <p className="subtitle">Join the CollabStudy community</p>
            </div>
            <form className="reg-form" id="signupForm" autoComplete="off" onSubmit={handleSubmit}>
                <label>Username
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                </label>
                <label>AAU Email
                    <input
                        type="email"
                        placeholder="name.ugr-xxxx-xx@aau.edu.et"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>Password
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>Confirm Password
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                </label>
                <label>
                    Major or Department
                    <input
                        type="text"
                        placeholder="e.g., Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </label>
                <label>
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
                {message && (
                    <p className={`form-message ${messageType}`}>
                        {message}
                    </p>
                )}

                <button type="submit" className="create">Create Account</button>
            </form>
            <div className="or-line">
                <span className="or-line">or</span>
            </div>
            <p className="login-foot">
                Already have an account? <Link to="/Login" className="login-link">Log In</Link>
            </p>
            <p className="help">
                Need help?{" "}
                <a className="contact-us" href="#">Contact Us</a>
            </p>
        </div>
    </div>
  );
}
export default Signup;