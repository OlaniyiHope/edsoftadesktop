import React from "react";
import { useNavigate } from "react-router-dom";

import "./admin.css"
import useAuth from "./useAuth";
const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const clearNotes = () => {
    if (!window.confirm("Delete all notes?")) return;
    localStorage.removeItem("notes");
    alert("Notes cleared");
  };

  const clearSavedQuestions = () => {
    if (!window.confirm("Remove all saved questions?")) return;
    localStorage.removeItem("savedQuestions");
    alert("Saved questions cleared");
  };

  return (
    <div className="dashboard settings-page">
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Settings</h2>

        <div className="settings-card">
          <h4>User</h4>
          <p>{user.username || user.fullname || "User"}</p>
        </div>

        <div className="settings-card">
          <h4>Data</h4>

          <button onClick={clearNotes}>Clear Notes</button>

          <button onClick={clearSavedQuestions}>
            Clear Saved Questions
          </button>
        </div>

        <div className="settings-card">
          <h4>Account</h4>

          <button className="logout-setting-btn" onClick={() => {
            logout();
            navigate("/login");
          }}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
