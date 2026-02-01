import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGroups } from "../api";
import "../styles/myProfile.css";
import "../styles/general.css";

export default function MyProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [createdGroups, setCreatedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Fetch profile on load
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
          setUsername(data.user.username);
          setEmail(data.user.email);
          setDepartment(data.user.department || "");
          setYear(data.user.year || "");
          setBio(data.user.bio || "No bio added yet.");
        } else {
          setStatusMessage(data.message || "Failed to load profile.");
        }
      } catch (err) {
        console.error(err);
        setStatusMessage("Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchUserGroups();
  }, [token, navigate]);

  const fetchUserGroups = async () => {
    try {
      const response = await getUserGroups();
      setCreatedGroups(response.data.createdGroups || []);
      setJoinedGroups(response.data.joinedGroups || []);
    } catch (error) {
      console.error("Failed to fetch user groups:", error);
    } finally {
      setGroupsLoading(false);
    }
  };

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
          body: JSON.stringify({ username, email, department, year, bio }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatusMessage("Profile updated successfully!");
          setBio(data.user.bio || "No bio added yet."); // fallback
          
          // Update localStorage with new user data
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('profileUpdated'));
        } else {
          setStatusMessage(data.error || "Failed to update profile.");
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
        alert(data.error || "Failed to delete account.");
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
        <button className="close-btn" onClick={() => navigate("/dashboard")}>
          ✕
        </button>
      </header>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <main className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar icon-avatar">
            <svg className="avatar-icon" width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Username</span>
              <input
                className="info-value"
                type="text"
                value={username}
                readOnly={!editing}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <input
                className="info-value"
                type="email"
                value={email}
                readOnly={!editing}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="info-item">
              <span className="info-label">Major</span>
              <input
                className="info-value"
                type="text"
                value={department}
                readOnly={!editing}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="info-item">
              <span className="info-label">Year</span>
              <input
                className="info-value"
                type="text"
                value={year}
                readOnly={!editing}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="info-item">
              <span className="info-label">Bio</span>
              <textarea
                className="info-value"
                rows="3"
                value={bio}
                readOnly={!editing}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <button className="edit-profile-btn" onClick={toggleEditing}>
              {editing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="danger-zone-card">
          <h2 className="danger-zone-title">Danger Zone</h2>
          <p className="danger-zone-text">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="delete-account-btn" onClick={confirmDeleteAccount}>
            Delete Account
          </button>
        </div>

        <div className="groups-section">
          <h2 className="section-title">My Groups</h2>
          
          <div className="groups-container">
            <div className="group-category">
              <h3>Created Groups ({createdGroups.length})</h3>
              {groupsLoading ? (
                <p>Loading groups...</p>
              ) : createdGroups.length > 0 ? (
                <div className="groups-list">
                  {createdGroups.map((group) => (
                    <div key={group._id} className="group-card" onClick={() => navigate(`/GroupPage?groupId=${group._id}`)}>
                      <h4>{group.name}</h4>
                      <p>{group.department} • {group.year}</p>
                      <span className="group-role">Admin</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-groups">No groups created yet</p>
              )}
            </div>

            <div className="group-category">
              <h3>Joined Groups ({joinedGroups.length})</h3>
              {groupsLoading ? (
                <p>Loading groups...</p>
              ) : joinedGroups.length > 0 ? (
                <div className="groups-list">
                  {joinedGroups.map((group) => (
                    <div key={group._id} className="group-card" onClick={() => navigate(`/GroupPage?groupId=${group._id}`)}>
                      <h4>{group.name}</h4>
                      <p>{group.department} • {group.year}</p>
                      <span className="group-role">Member</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-groups">No groups joined yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
