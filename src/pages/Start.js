
import { useState, useEffect } from "react";
import AddUser from "./AddUser";
import "./admin.css";
import TopicModal from "./TopicModal";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCog,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaStickyNote
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Start = () => {
  const [activeTab, setActiveTab] = useState("key");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showActivationModal, setShowActivationModal] = useState(false);
  const isActivated = localStorage.getItem("isActivated") === "true";
  const FREE_QUESTION_LIMIT = 5;
const [showCalculator, setShowCalculator] = useState(false);
const [savedQuestions, setSavedQuestions] = useState([]);
const [showSaved, setShowSaved] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examConfig, setExamConfig] = useState(null);
  const [activeSubject, setActiveSubject] = useState("");
  const [questionsBySubject, setQuestionsBySubject] = useState({}); 
const [showReport, setShowReport] = useState(false);
const [reportText, setReportText] = useState("");

  const { logout } = useAuth();
  const [username, setUsername] = useState("");

  // Load exam config
  useEffect(() => {
    const stored = localStorage.getItem("examConfig");
    if (stored) {
      const parsed = JSON.parse(stored);
      setExamConfig(parsed);
      const firstSubject = Object.keys(parsed.subjects)[0];
      setActiveSubject(firstSubject);
    }
  }, []);

  // Load username
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username || user.fullname || "");
    }
  }, []);

  // Fetch questions
  useEffect(() => {
    if (!examConfig) return;

    const allSubjects = Object.keys(examConfig.subjects);
    allSubjects.forEach((subject) => {
      const config = examConfig.subjects[subject];
      window.api
        .getQuestionsForSubject(subject, config.selectedTopics, 50)
        .then((data) => {
          setQuestionsBySubject((prev) => ({
            ...prev,
            [subject]: data
          }));

          // Set first subject questions
          if (!questions.length && subject === allSubjects[0]) {
            setQuestions(data);
            setCurrentIndex(0);
            setActiveSubject(subject);
          }
        });
    });
  }, [examConfig]);

  // Switch subject
  const switchSubject = (subject) => {
    setActiveSubject(subject);
    setQuestions(questionsBySubject[subject] || []);
    setCurrentIndex(0);
  };

  // Current question
  const currentQuestion = questions[currentIndex];

  // Handle option select
  const handleSelectOption = (key) => {
    const questionKey = `${activeSubject}-${currentIndex}`;

    // Block selection if not activated and beyond free limit
    if (!isActivated && currentIndex >= FREE_QUESTION_LIMIT) {
      setShowActivationModal(true);
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionKey]: key
    }));
  };

  // Navigation
  const goNext = () => {
    if (!isActivated && currentIndex >= FREE_QUESTION_LIMIT - 1) {
      setShowActivationModal(true);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // Submit
  // const handleSubmit = () => {
  //   const allQuestions = Object.keys(questionsBySubject)
  //     .map((sub) =>
  //       questionsBySubject[sub].map((q, i) => ({
  //         ...q,
  //         subject: sub,
  //         localIndex: i,
  //         key: `${sub}-${i}`
  //       }))
  //     )
  //     .flat();

  //   let correctAnswers = 0;

  //   allQuestions.forEach((q) => {
  //     const userAnswer = answers[`${q.subject}-${q.localIndex}`];
  //     const correctAnswer = q.Answer?.replace(/<[^>]*>/g, "").trim();

  //     if (userAnswer && userAnswer === correctAnswer) correctAnswers++;
  //   });

  //   navigate("/performance-history", {
  //     state: {
  //       questions: allQuestions,
  //       answers
  //     }
  //   });
  // };
const handleSubmit = () => {
  const allQuestions = Object.keys(questionsBySubject)
    .map((sub) =>
      questionsBySubject[sub].map((q, i) => ({
        ...q,
        subject: sub,
        localIndex: i,
        key: `${sub}-${i}`
      }))
    )
    .flat();

  let correctAnswers = 0;

  allQuestions.forEach((q) => {
    const userAnswer = answers[`${q.subject}-${q.localIndex}`];
    const correctAnswer = q.Answer?.replace(/<[^>]*>/g, "").trim();

    if (userAnswer && userAnswer === correctAnswer) correctAnswers++;
  });

  // Grab active profile and exam ID
  const activeProfileId = localStorage.getItem("activeProfileId");
  const examId = localStorage.getItem("activeExamId"); // or wherever you store exam ID

  if (activeProfileId && examId) {
    // Save exam result
    window.api.saveExamResult({
      profileId: parseInt(activeProfileId),
      examId: parseInt(examId),
      score: correctAnswers
    });
  }

  // Navigate to performance history
  navigate("/performance-history", {
    state: {
      questions: allQuestions,
      answers
    }
  });
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveQuestion = () => {
  if (!currentQuestion) return;

  const key = `${activeSubject}-${currentIndex}`;

  // avoid duplicates
  if (savedQuestions.find((q) => q.key === key)) return;

  setSavedQuestions((prev) => [
    ...prev,
    {
      ...currentQuestion,
      key,
      subject: activeSubject,
      index: currentIndex
    }
  ]);
};

const [calcValue, setCalcValue] = useState("");

const handleCalc = (val) => {
  if (val === "=") {
    try {
      setCalcValue(eval(calcValue).toString());
    } catch {
      setCalcValue("Error");
    }
    return;
  }

  setCalcValue((prev) => prev + val);
};

  return (
    <div className="dashboard exam-dashboard">
      {/* LEFT SIDEBAR */}
      <aside className="exam-sidebar">
        <div className="user-box">
          <span className="label">Current user</span>
          <div className="user-info">
            <img alt="user" className="user-avatar" />
            <span>{username || "User"}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Log out
          </button>
        </div>

        <div className="timer-box">
          <span className="label">Time left</span>
          <div className="timer">00:29:13</div>
        </div>

        <div className="tools">
        <button onClick={handleSaveQuestion}>＋ Save Question</button>
<button onClick={() => setShowSaved(true)}>
  📌 Saved ({savedQuestions.length})
</button>

       <button onClick={() => setShowCalculator(true)}>🧮 Calculator</button>

         <button onClick={() => setShowReport(true)}>⚠️ Report Error</button>

        </div>

        <button className="submit-test-btn" onClick={handleSubmit}>
          Submit test
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="exam-main exam-content">
        {/* SUBJECT TABS */}
        <div className="exam-tabs">
          {examConfig &&
            Object.keys(examConfig.subjects).map((subject) => (
              <button
                key={subject}
                className={`exam-tab ${subject === activeSubject ? "active" : ""}`}
                onClick={() => switchSubject(subject)}
              >
                {subject}
              </button>
            ))}
        </div>

        {/* QUESTION PANEL */}
        <section className="question-panel">
          <p className="question-count">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <div
            className="question-box"
            dangerouslySetInnerHTML={{ __html: currentQuestion?.Question || "" }}
          />

          {/* OPTIONS */}
          <div className="options">
            {currentQuestion?.Options?.map((opt) => (
              <label key={opt.Key} className="option">
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  checked={answers[`${activeSubject}-${currentIndex}`] === opt.Key}
                  onChange={() => handleSelectOption(opt.Key)}
                />
                <span dangerouslySetInnerHTML={{ __html: opt.Value }} />
              </label>
            ))}
          </div>

          {/* NAVIGATION */}
          <div className="question-nav">
            <button className="nav-btn" onClick={goPrev} disabled={currentIndex === 0}>
              ← Previous
            </button>
            <button
              className="nav-btn primary"
              onClick={goNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next →
            </button>
          </div>

          {/* QUESTION GRID */}
     {/* QUESTION GRID */}
<div className="question-grid">
  {questions.map((_, i) => {
    const locked = !isActivated && i >= FREE_QUESTION_LIMIT;

    return (
      <button
        key={i}
        className={`grid-btn ${
          i === currentIndex ? "active" : ""
        } ${answers[`${activeSubject}-${i}`] ? "answered" : ""} ${
          locked ? "locked" : ""
        }`}
        onClick={() => {
          if (locked) {
            setShowActivationModal(true); // show modal for locked questions
          } else {
            setCurrentIndex(i); // switch question if not locked
          }
        }}
      >
        {i + 1}
      </button>
    );
  })}
</div>

        </section>
      </main>

      {/* ACTIVATION MODAL */}
      {showActivationModal && (
        <div className="activation-modal-overlay">
          <div className="activation-modal">
            <h2>Activation Required</h2>
            <p>
              You have reached the free limit of 5 questions for this subject.
              Activate the app to continue practicing.
            </p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowActivationModal(false)}>
                Cancel
              </button>
              <button className="activate-btn" onClick={() => navigate("/activate")}>
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
      {showCalculator && (
  <div className="modal-overlay">
    <div className="calculator-card">
      <button
        className="modal-close"
        onClick={() => setShowCalculator(false)}
      >
        ✕
      </button>

      <input
        className="calc-display"
        value={calcValue}
        readOnly
      />

      <div className="calc-grid">
        {["7","8","9","/",
          "4","5","6","*",
          "1","2","3","-",
          "0",".","=","+"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleCalc(btn)}
          >
            {btn}
          </button>
        ))}

        <button className="clear-btn" onClick={() => setCalcValue("")}>
          C
        </button>
      </div>
    </div>
  </div>
)}
{showSaved && (
  <div className="modal-overlay">
    <div className="saved-card">
      <button className="modal-close" onClick={() => setShowSaved(false)}>
        ✕
      </button>

      <h3>Saved Questions</h3>

      {savedQuestions.length === 0 && (
        <p>No saved questions yet.</p>
      )}

     {savedQuestions.map((q, i) => (
  <div
    key={i}
    className="saved-item"
    onClick={() => {
      setActiveSubject(q.subject);
      setQuestions(questionsBySubject[q.subject]);
      setCurrentIndex(q.index);
      setShowSaved(false);
    }}
  >
    <strong>{q.subject} — Q{q.index + 1}</strong>

    <div
      className="saved-question-text"
      dangerouslySetInnerHTML={{
        __html: q.Question || q.question || ""
      }}
    />
  </div>
))}

    </div>
  </div>
)}
{showReport && (
  <div className="modal-overlay">
    <div className="report-card">
      <button className="modal-close" onClick={() => setShowReport(false)}>
        ✕
      </button>

      <h3>Report Question Error</h3>

      <div className="report-question">
        <strong>
          {activeSubject} — Question {currentIndex + 1}
        </strong>

        <div
          className="report-question-text"
          dangerouslySetInnerHTML={{
            __html: currentQuestion?.Question || ""
          }}
        />
      </div>

      <textarea
        placeholder="Describe the problem (wrong answer, typo, unclear question...)"
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
      />

      <button
        className="submit-report-btn"
        onClick={() => {
          if (!reportText.trim()) return;

          const reports =
            JSON.parse(localStorage.getItem("reports") || "[]");

          reports.push({
            subject: activeSubject,
            index: currentIndex,
            question: currentQuestion?.Question,
            message: reportText,
            time: new Date().toISOString()
          });

          localStorage.setItem("reports", JSON.stringify(reports));

          setReportText("");
          setShowReport(false);
        }}
      >
        Submit Report
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Start;
