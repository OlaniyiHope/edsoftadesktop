import { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaBook,
  FaPlay,
  FaPause,
  FaStop,
  FaArrowLeft,
  FaHeadphones,
  FaMicrophone
} from "react-icons/fa";
import "./admin.css";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// OR
import { FaBookOpenReader } from "react-icons/fa6";

const StudyMat = () => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState("");
    const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [playing, setPlaying] = useState(false);
const [open, setOpen] = useState(false);
  /* =======================
     LOAD STUDY SUBJECTS
  ======================= */
  useEffect(() => {
    console.log("🚀 StudyMat mounted");
    console.log("window.api =", window.api);

    if (!window.api?.getStudySubjects) {
      console.error("❌ getStudySubjects not found in preload");
      return;
    }

    window.api.getStudySubjects()
      .then((data) => {
        console.log("✅ Study subjects loaded:", data);
        setSubjects(data);
        if (data.length) setSubject(data[0]);
      })
      .catch((err) => {
        console.error("❌ Failed to load study subjects:", err);
      });
  }, []);

  /* =======================
     LOAD TOPICS FOR SELECTED STUDY SUBJECT
  ======================= */
  useEffect(() => {
    if (!subject) return;

    console.log("📘 Selected subject:", subject);

    if (!window.api?.getStudyTopics) {
      console.error("❌ getStudyTopics not found in preload");
      return;
    }

    window.api.getStudyTopics(subject)
      .then((files) => {
        console.log("📂 Study topics loaded:", files);
        setTopics(files);
        if (files.length) setActiveTopic(files[0]);
      })
      .catch((err) => {
        console.error("❌ Failed to load study topics:", err);
      });
  }, [subject]);

  /* =======================
     LOAD STUDY CONTENT (HTML)
  ======================= */
  useEffect(() => {
    if (!subject || !activeTopic) return;

    console.log("📄 Loading study content:", subject, activeTopic);

    if (!window.api?.getStudyContent) {
      console.error("❌ getStudyContent not found in preload");
      return;
    }

    window.api.getStudyContent(subject, activeTopic)
      .then((html) => {
        console.log("✅ Study content loaded (length):", html?.length);
        setContent(html);
      })
      .catch((err) => {
        console.error("❌ Failed to load study content:", err);
      });
  }, [subject, activeTopic]);

  return (
    <div className="study-layout">
      {/* LEFT */}
      <aside className="study-sidebar">
          <button
      className="back-arrow-btn"
      onClick={() => navigate("/")}
      title="Go back"
    >
      <FaArrowLeft />
    </button>
<div className="subject-row">
  {/* SUBJECT DROPDOWN */}
  <div className="subject-wrapper">
    <button
      className="subject-button"
      onClick={() => setOpen(!open)}
    >
      <span>{subject}</span>
      <FaChevronDown className={`chevron ${open ? "rotate" : ""}`} />
    </button>

    {open && (
      <div className="subject-menu">
        {subjects.map((s) => (
          <div
            key={s}
            className={`subject-item ${s === subject ? "active" : ""}`}
            onClick={() => {
              setSubject(s);
              setOpen(false);
            }}
          >
            {s}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* MIC BUTTON — SIBLING, NOT CHILD */}
  <button
    className="audio-btn"
    title="Listen to material"
    onClick={() => console.log("Play audio for", subject)}
  >
    <FaMicrophone />
  </button>
</div>

<div className="topic-list">
  {topics.map((file) => (
    <div
      key={file}
      className={`topic-item ${
        activeTopic === file ? "active" : ""
      }`}
      onClick={() => setActiveTopic(file)}
    >
      {/* ICON CONTAINER */}
      <div className="topic-icon">
        <FaBookOpen />
      </div>

      <div className="topic-text">
        <strong>{file}</strong>
      </div>
    </div>
  ))}
</div>

      </aside>

      {/* MAIN */}
      <main className="study-content">
        <header className="study-header">
          <h2>
            {subject} {activeTopic && `| ${activeTopic}`}
          </h2>
          <button className="practice-btn">
            Practice on this theme
          </button>
        </header>

        <section className="content-card">
          {content ? (
            <article
              className="content-body"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p style={{ padding: 20 }}>📄 No content loaded</p>
          )}
        </section>

        <div className="audio-player">
          <FaHeadphones className="audio-icon" />
          <button onClick={() => setPlaying(!playing)}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <button>
            <FaStop />
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudyMat;
