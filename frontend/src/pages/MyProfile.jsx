import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/myProfile.css";
import "../styles/general.css";

export default function MyProfile() {
  const navigate = useNavigate();

  // State for edit mode
  const [editing, setEditing] = useState(false);

  // Profile field states
  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("test.ugr-9470-16@aau.edu.et");
  const [major, setMajor] = useState("Software Engineering");
  const [year, setYear] = useState("3rd Year");
  const [bio, setBio] = useState("No bio added yet.");

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    if (editing) {
      alert("Profile saved (placeholder).");
    }
  };

  const confirmDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      alert("Account deleted (placeholder).");
    }
  };

  return (
    <>
    <div className="whole-myprofile">
      <header className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <button
          className="close-btn"
          aria-label="Close"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <main className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar icon-avatar">
            <svg
              className="avatar-icon"
              width={56}
              height={56}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </div>

          <div className="profile-info">
            {/* Username */}
            <div className="info-item">
              <div className="info-label">
                <svg
                  className="info-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Username</span>
              </div>
              <input
                className="info-value"
                type="text"
                value={username}
                readOnly={!editing}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="info-item">
              <div className="info-label">
                <svg
                  className="info-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </div>
              <input
                className="info-value"
                type="email"
                value={email}
                readOnly={!editing}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Major */}
            <div className="info-item">
              <div className="info-label">
                <svg
                  className="info-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Major</span>
              </div>
              <input
                className="info-value"
                type="text"
                value={major}
                readOnly={!editing}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

            {/* Year */}
            <div className="info-item">
              <div className="info-label">
                <svg
                  className="info-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Year</span>
              </div>
              <input
                className="info-value"
                type="text"
                value={year}
                readOnly={!editing}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="info-item">
              <div className="info-label">
                <svg
                  className="info-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Bio</span>
              </div>
              <textarea
                className="info-value"
                rows="3"
                value={bio}
                readOnly={!editing}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            {/* Edit Profile Button */}
            <div className="edit-profile-btn" onClick={toggleEditing}>
              <svg
                className="btn-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>{editing ? "Save Profile" : "Edit Profile"}</span>
            </div>
          </div>
        </div>

        {/* Joined Groups */}
        <div className="groups-section">
          <h2 className="groups-title">Joined Groups</h2>
          <div className="groups-grid">
            <Link to="/group_calculus" className="group-card joined">
              <div className="our-groups-icon">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="group-info">
                <h3>Calculus Study Group</h3>
                <p>Math 201</p>
                <span>5 members</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Created Groups */}
        <div className="groups-section">
          <h2 className="groups-title">Created Groups</h2>
          <div className="groups-grid">
            <Link to="/group_algorithms" className="group-card created">
              <div className="our-groups-icon">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="group-info">
                <h3>Advanced Algorithms</h3>
                <p>CS 401</p>
                <span>3 members</span>
                <span className="owner-badge">Owner</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone-card">
          <h2 className="danger-zone-title">Danger Zone</h2>
          <p className="danger-zone-text">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            className="delete-account-btn"
            onClick={confirmDeleteAccount}
          >
            <svg
              className="btn-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Delete Account</span>
          </button>
        </div>
      </main>

      {/* Floating AI chatbot */}
      <div className="chatbot-container">
        <div className="chatbot-dot"></div>
        <button
          className="chatbot"
          aria-label="chatbot button"
          type="button"
          onClick={() => navigate("/ai")}
        >
          <svg
            className="chatbot-icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="6" y="8" width="12" height="10" rx="1.5" fill="white" />
            <rect x="8.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="13.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="4" y="11" width="2" height="5" rx="0.5" fill="white" />
            <rect x="18" y="11" width="2" height="5" rx="0.5" fill="white" />
          </svg>
        </button>
      </div>
    </div>
    </>
  );
}

