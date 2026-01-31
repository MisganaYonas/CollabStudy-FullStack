import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGroup } from "../api";
import "../styles/createGroup.css";
import Logo from "../images/Logo.png";

function CreateGroup() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Require authentication
  React.useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);
  const [currentStep, setCurrentStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [maxMembers, setMaxMembers] = useState(7);
  const [memberEmail, setMemberEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const steps = ["Basic info", "Schedule", "Members (Optional)"];

  const activateStep = (index) => {
    setCurrentStep(index);
    setMessage("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddMember = () => {
    // NOTE: The Create Group endpoint does NOT take a list of members. 
    // Spec: "Defaults: admin = creator, members = [admin]".
    // Invitation is a SEPARATE endpoint: "8. INVITE MEMBER".
    // So I cannot add members during creation.
    // I should probably remove this step or explain that members can be invited AFTER creation.
    // But wait, the mock UI has "Members" step.
    // If strict backend matching: I create group first. THEN I call invite for each member?
    // Or I just remove the Member step to simplify and stick to "Create Group" endpoint.
    // "Frontend must match backend exactly".
    // I will Change Step 3 to "Review"? Or just remove Step 3?
    // If I remove Step 3, the user might be confused.
    // I'll keep the UI but change logic: 
    // 1. Call Create Group. 
    // 2. If success, Call Invite for each email in the list.
    // This seems like a good "Frontend" feature that orchestrates multiple backend calls.

    if (!memberEmail) {
      showMessage("Please enter an email to add.", "red");
      return;
    }
    if (!memberEmail.endsWith("@aau.edu.et")) {
      showMessage("Only AAU email addresses are allowed.", "red");
      return;
    }
    // Just local state validation
    showMessage(`Ready to invite: ${memberEmail}`, "green");
    // I'll just store it in a temp list to invite later? 
    // Wait, the current code stores in `members`.
    // I will use that.
    setMembers((prev) => [...prev, memberEmail]);
    setMemberEmail("");
  };

  const [members, setMembers] = useState([]);

  const showMessage = (msg, color) => {
    setMessage(msg);
    setMessageColor(color);
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      showMessage("Group name is required.", "red");
      activateStep(0);
      return;
    }
    if (!department) {
      showMessage("Department is required.", "red");
      activateStep(0);
      return;
    }
    if (!year) {
      showMessage("Year is required.", "red");
      activateStep(0);
      return;
    }
    if (!selectedTime) {
      showMessage("Please select a meeting time.", "red");
      activateStep(1);
      return;
    }
    if (selectedDays.length === 0) {
      showMessage("Please select at least one meeting day.", "red");
      activateStep(1);
      return;
    }

    try {
      const groupData = {
        name: groupName,
        department,
        year,
        meetingTime: selectedTime,
        meetingDays: selectedDays,
        maxMembers: parseInt(maxMembers),
      };

      console.log("Create group - Sending data:", groupData);
      console.log("Create group - Data values:", {
        name: groupName,
        department,
        year,
        meetingTime: selectedTime,
        meetingDays: selectedDays,
        maxMembers: parseInt(maxMembers),
      });

      const response = await createGroup(groupData);
      console.log("Create group response:", response);
      
      // Backend returns: { message: "Group created", group: { _id: ..., ... } }
      if (response.data?.message === "Group created" || response.status === 201) {
        showMessage("Study group created successfully!", "green");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        showMessage("Group created but unexpected response format", "red");
      }

    } catch (error) {
      console.error("Create group error:", error);
      console.error("Error response:", error.response);
      let errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to create group";
      
      // If there are missing fields, show them
      if (error.response?.data?.missingFields) {
        errorMessage = `Missing required fields: ${error.response.data.missingFields.join(", ")}`;
      }
      
      showMessage(errorMessage, "red");
    }
  };

  return (
    <div className="page">
      <div className="modal-card">
        <header className="modal-header">
          <Link to="/dashboard">
            <button className="close-btn" aria-label="Close">×</button>
          </Link>

          <div className="logo-badge">
            <div className="logo-circle">
              <img src={Logo} alt="Logo" />
            </div>
            <span className="logo-text">Study Group</span>
          </div>

          <h1 className="title">Create Your Study Group</h1>
          <p className="subtitle">
            Build a community and achieve academic excellence together
          </p>

          <div className="steps">
            {steps.map((label, i) => (
              <div key={i} className={`step ${i === currentStep ? "active" : ""}`} onClick={() => activateStep(i)}>
                <span>{i + 1}</span>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </header>

        <main className="modal-body">
          {currentStep === 0 && (
            <section className="card-section">
              <div className="section-header">
                <span className="section-icon"></span>
                <h2>Basic Information</h2>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Group Name*</label>
                  <input type="text" placeholder="e.g. Data Structures Champions"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Department*</label>
                  <input type="text" placeholder="e.g. CSE"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className="field-group">
                <label>Year*</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </section>
          )}

          {currentStep === 1 && (
            <section className="card-section">
              <div className="section-header">
                <span className="section-icon"></span>
                <h2>Study Schedule</h2>
              </div>

              <div className="field-group">
                <label>Preferred Meeting Time*</label>
                <div className="time-options">
                  {["Morning", "Afternoon", "Evening"].map((time) => (
                    <button
                      key={time}
                      className={`time-card ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <span className={`time-icon ${time.toLowerCase()}`}></span>
                      <div className="time-text">
                        <strong>{time}</strong>
                        <span>
                          {time === "Morning" ? "8:00 AM - 10:00 AM" :
                            time === "Afternoon" ? "2:00 PM - 5:00 PM" :
                              "5:00 PM - 9:00 PM"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-row days-members">
                <div className="field-group">
                  <label>Meeting Days</label>
                  <div className="days-grid">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <button
                        key={day}
                        className={`day-chip ${selectedDays.includes(day) ? "selected" : ""}`}
                        onClick={() => handleDayToggle(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-group members-group">
                  <label>Maximum Members</label>
                  <div className="slider-row">
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(e.target.value)}
                    />
                    <span className="slider-value">{maxMembers}</span>
                  </div>
                  <small>Select between 2–10 members</small>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="card-section">
              <div className="section-header">
                <span className="section-icon"></span>
                <h2>Invites (Skipped for creation)</h2>
              </div>

              <div className="members-bar">
                <div className="members-info">
                  <p>Groups are created with you as the admin. You can invite members after creation from the Group Page.</p>
                </div>
              </div>

            </section>
          )}
        </main>

        <footer className="modal-footer">
          <Link to="/dashboard">
            <button className="btn btn-secondary">Back to Dashboard</button>
          </Link>
          <button className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
          {message && <p style={{ color: messageColor, marginTop: "10px" }}>{message}</p>}
        </footer>
      </div>
    </div>
  );
}

export default CreateGroup;
