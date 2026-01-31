import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/myProfile.css";
import "../styles/general.css";

export default function MyProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUsername(data.username || "");
          setEmail(data.email || "");
          setMajor(data.department || data.major || "");
          setYear(data.year || "");
          setBio(data.bio || "");
        } else {
          setStatusMessage(`${data.message || "Failed to load profile."}`);
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const toggleEditing = async () => {
    if (editing) {
     
      setStatusMessage("Saving...");
      try {
        const res = await fetch("http://localhost:5000/api/profile/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, email, department: major, year, bio }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatusMessage("Profile updated successfully!");
          // Update local state with the returned user data
          if (data.user) {
            setUsername(data.user.username || username);
            setEmail(data.user.email || email);
            setMajor(data.user.department || major);
            setYear(data.user.year || year);
            setBio(data.user.bio || bio);
          }
        } else {
          setStatusMessage(`${data.error || data.message || "Failed to update profile."}`);
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("Server error while saving profile.");
      }
    }
    setEditing(!editing);
  };

  const confirmDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deleted successfully.");
        localStorage.clear();
        navigate("/signup"); 
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while deleting account.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="whole-myprofile">
      <header className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <button
          className="close-btn"
          aria-label="Close"
          onClick={() => navigate("/dashboard")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

Praise, [1/31/2026 1:34 AM]
<main className="profile-page">
        <div className="profile-card">
          
          <div className="profile-avatar icon-avatar">
            <svg className="avatar-icon" width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </div>

          <div className="profile-info">
            
            {[
              { label: "Username", value: username, setValue: setUsername, type: "text" },
              { label: "Email", value: email, setValue: setEmail, type: "email" },
              { label: "Major", value: major, setValue: setMajor, type: "text" },
              { label: "Year", value: year, setValue: setYear, type: "text" },
            ].map((field, i) => (
              <div className="info-item" key={i}>
                <div className="info-label">
                  <span>{field.label}</span>
                </div>
                <input
                  className="info-value"
                  type={field.type}
                  value={field.value}
                  readOnly={!editing}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </div>
            ))}

           
            <div className="info-item">
              <div className="info-label"><span>Bio</span></div>
              <textarea
                className="info-value"
                rows="3"
                value={bio}
                readOnly={!editing}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

           
            <div className="edit-profile-btn" onClick={toggleEditing}>
              <span>{editing ? "Save Profile" : "Edit Profile"}</span>
            </div>
          </div>
        </div>

       
        <div className="danger-zone-card">
          <h2 className="danger-zone-title">Danger Zone</h2>
          <p className="danger-zone-text">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="delete-account-btn" onClick={confirmDeleteAccount}>
            <span>Delete Account</span>
          </button>
        </div>
      </main>
    </div>
  );
}

