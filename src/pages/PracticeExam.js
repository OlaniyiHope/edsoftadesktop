

import { useState } from "react";
import {
  FaBell,
  FaCog,
  FaHome,
  FaNewspaper,
  FaStickyNote,
  FaPlus
} from "react-icons/fa";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import imgg from "./practiceicon/p1.png";
import SideNav from "./SideNav";
const PracticeExam = () => {
  const [withTimer, setWithTimer] = useState(true);
  const [hours, setHours] = useState(30);
  const [minutes, setMinutes] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <SideNav />
      {/* MAIN BODY */}
      <main className="body">
        <h1 className="page-title">Practice Exam</h1>

        <div className="practice-layout">
          {/* LEFT */}
          <section className="practice-left">

            <div className="intro-box">
                              <img
  src={imgg}

  className="grid-icon"
   style={{width: "150px", height: "150px", margin: "auto"}}
/>
              <p>
                Take tests from a very robust repository of contents,
                with preferred settings and filters.
              </p>
            </div>

            <div className="timer-section">
              <h4>Set practice mode</h4>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={withTimer}
                  onChange={() => setWithTimer(!withTimer)}
                />
                With Timer
              </label>

              {withTimer && (
                <div className="timer-box">
                  <div className="time-group">
                    <label>Hours</label>
                    <div className="time-control">
                      <button onClick={() => setHours(h => h + 1)}  style={{ color: '#0366D6' }} >▲</button>
                      <span  style={{ color: '#0366D6' }} >{hours}</span>
                      <button onClick={() => setHours(h => Math.max(h - 1, 0))}  style={{ color: '#0366D6' }} >▼</button>
                    </div>
                  </div>

                  <span className="colon"  style={{ color: '#0366D6' }} >:</span>

                  <div className="time-group">
                    <label>Minutes</label>
                    <div className="time-control">
                      <button onClick={() => setMinutes(m => (m + 1) % 60)}  style={{ color: '#0366D6' }} >▲</button>
                      <span  style={{ color: '#0366D6' }} >{minutes.toString().padStart(2, "0")}</span>
                      <button onClick={() => setMinutes(m => (m - 1 + 60) % 60)}  style={{ color: '#0366D6' }} > ▼</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="practice-rights">
            <h4>💡 Select practice type</h4>

            <label className="select-label">Select exam type</label>
            <select className="select-box">
              <option>Objectives</option>
            </select>

            <p className="desc">
              1. Select subjects, number of questions and topics of your choice
              to properly revise areas in a particular subject.
            </p>

        <button
      className="primary-btn"
      onClick={() => navigate("/topic")}
      style={{backgroundColor: "#0366D6"}}
    >
      Practice by Subject
    </button>

            <p className="desc">
              2. Select subjects, number and year of previous questions of your choice.
            </p>

            <button className="primary-btn outline"       style={{backgroundColor: "#0366D6", color: "white"}}    onClick={() => navigate("/year")}>Practice by Year</button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PracticeExam;
