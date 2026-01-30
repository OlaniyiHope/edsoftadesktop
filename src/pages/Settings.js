import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import "./admin.css";

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-wrapper">
      {/* Header */}
      <div className="settings-header">
        <button className="back-arrow" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Settings</h2>

        <button className="primary-btn-sm">Check for app updates</button>
      </div>

      {/* Notifications */}
      <div className="settings-group">
        <h4>Notifications</h4>

        <div className="settings-row">
          <span>Allow Notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      {/* General */}
      <div className="settings-group">
        <h4>General</h4>

        <div className="settings-row">
          <span>Theme</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="settings-row clickable">
          <span>Manage Users</span>
          <span>›</span>
        </div>

        <button className="outline-btn">Check for content updates</button>
      </div>

      {/* About */}
      <div className="settings-group">
        <h4>About</h4>

        <div className="info-card">
          <strong>Account</strong>
          <p>{user.username || "User"}</p>
            <p>{user.email || "Email"}</p>
        </div>

        <div className="info-card">
          <strong>Device</strong>
          <p>Product ID</p>
          <small>App version 2.0.123</small>
        </div>
      </div>

      {/* Legal */}
      <div className="settings-group">
        <h4>Legal</h4>

        <div className="settings-row clickable">
          <span>Open Source Licenses</span>
          <span>›</span>
        </div>

        <div className="settings-row clickable">
          <span>Terms of Use & Privacy</span>
          <span>›</span>
        </div>
      </div>

      {/* Logout */}
      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}
