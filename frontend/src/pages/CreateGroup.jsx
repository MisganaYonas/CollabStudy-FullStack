import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGroup, inviteMember } from "../api";
import "../styles/createGroup.css";
import Logo from "../images/Logo.png";

function CreateGroup() {
  const navigate = useNavigate();
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
    if (!memberEmail) {
      showMessage("Please enter an email to add.", "red");
      return;
    }
    if (!memberEmail.endsWith("@aau.edu.et")) {
      showMessage("Only AAU email addresses are allowed.", "red");
      return;
    }
    if (members.includes(memberEmail)) {
      showMessage("Email already added.", "red");
      return;
    }
    setMembers((prev) => [...prev, memberEmail]);
    setMemberEmail("");
    showMessage(`${memberEmail} added to invite list.`, "green");
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
      const token = localStorage.getItem("token");
      if (!token) {
        showMessage("You must be logged in to create a group.", "red");
        return;
      }

      const groupData = {
        name: groupName,
        department,
        year,
        meetingTime: selectedTime,
        meetingDays: selectedDays,
        membersCount: parseInt(maxMembers) // Send as membersCount to match Postman format
      };

      console.log("Sending group data:", groupData);

      const response = await createGroup(groupData);
      const newGroupId = response.data.group._id || response.data.group.groupId || response.data.group.id;

      // Invite members if any were added
      if (members.length > 0) {
        for (const email of members) {
          try {
            await inviteMember({ groupId: newGroupId, email });
          } catch (inviteError) {
            console.error(`Failed to invite ${email}:`, inviteError);
          }
        }
        showMessage(`Group created and ${members.length} invitation(s) sent!`, "green");
      } else {
        showMessage("Study group created successfully!", "green");
      }
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Create group error:", error);
      showMessage(error.response?.data?.error || "Failed to create group", "red");
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
                  <option value="1st year">1st Year</option>
                  <option value="2nd year">2nd Year</option>
                  <option value="3rd year">3rd Year</option>
                  <option value="4th year">4th Year</option>
                  <option value="5th year">5th Year</option>
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
                <h2>Invite Members (Optional)</h2>
              </div>

              <div className="field-group">
                <label>Member Email</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="email" 
                    placeholder="student@aau.edu.et"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddMember}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {members.length > 0 && (
                <div className="members-list" style={{ marginTop: '15px' }}>
                  <label>Members to Invite:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {members.map((email, index) => (
                      <span key={index} style={{ 
                        backgroundColor: '#e9ecef', 
                        padding: '5px 10px', 
                        borderRadius: '15px', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {email}
                        <button 
                          onClick={() => setMembers(prev => prev.filter((_, i) => i !== index))}
                          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
