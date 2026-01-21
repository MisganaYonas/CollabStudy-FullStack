import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/createGroup.css";
import Logo from "../images/Logo.png";

function CreateGroup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [maxMembers, setMaxMembers] = useState(7);
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const steps = ["Basic info", "Schedule", "Members"];

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
      showMessage("This email is already added.", "red");
      return;
    }
    setMembers([...members, memberEmail]);
    setMemberEmail("");
    showMessage(`Added member: ${memberEmail}`, "green");
  };

  const showMessage = (msg, color) => {
    setMessage(msg);
    setMessageColor(color);
  };

  const handleCreateGroup = () => {
    if (!groupName) {
      showMessage("Group name is required.", "red");
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
    if (members.length === 0) {
      showMessage("Please add at least one member.", "red");
      activateStep(2);
      return;
    }

    const group = {
      name: groupName,
      course,
      description,
      time: selectedTime,
      days: selectedDays,
      maxMembers,
      members,
    };

    let allGroups = JSON.parse(localStorage.getItem("CollabStudyGroups")) || [];
    allGroups.push(group);
    localStorage.setItem("CollabStudyGroups", JSON.stringify(allGroups));
    showMessage("Study group created successfully!", "green");
    console.log("Saved group:", group);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
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
                  <label>Course/Subject*</label>
                  <input type="text" placeholder="e.g. CS 202 - Data Structures"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>
              </div>
              <div className="field-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your group goals, study plans, and what topics you'll cover..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
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
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
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
                  <small>Select between 2–7 members for your group</small>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="card-section">
              <div className="section-header">
                <span className="section-icon"></span>
                <h2>Build Your Team</h2>
              </div>

              <div className="members-bar">
                <div className="members-info">
                  <strong>Total Members: {members.length}/{maxMembers}</strong>
                  <span>Invite at least 1 more member to get started</span>
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Invite by email</label>
                  <input
                    type="email"
                    placeholder="student-ugr-xxxx-xx@campus.edu"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                </div>
                <button className="btn btn-outline" onClick={handleAddMember}>Add</button>
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
