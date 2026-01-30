

import React, { useState, useEffect } from "react";
import TopNav from "./TopNav";
import { useLocation } from "react-router-dom";
import "./exam.css";
import ExamResultModal from "./ExamResultModal";
const Exam = ({ totalTime }) => {
  const location = useLocation();
  const defaultSubjects = [
    "Mathematics",
    "English Language",
    "Literature",
    "Biology",
  ];

  // Use subjects from location.state if available, otherwise default subjects
  const subjects = location.state?.subjects?.length
    ? location.state.subjects
    : defaultSubjects;

  const [activeTab, setActiveTab] = useState(subjects[0] || "");
  const [remainingTime, setRemainingTime] = useState(totalTime * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Store selected answers
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const questions = {
    Mathematics: [
      {
        question: "What is 5 + 3?",
        options: { a: "6", b: "7", c: "8", d: "9" },
        correct: "c",
      },
      {
        question: "Solve: 10 - 4 = ?",
        options: { a: "5", b: "6", c: "7", d: "8" },
        correct: "b",
      },
      {
        question: "What is 6 × 7?",
        options: { a: "42", b: "36", c: "48", d: "49" },
        correct: "a",
      },
      {
        question: "Solve: 81 ÷ 9 = ?",
        options: { a: "8", b: "9", c: "10", d: "11" },
        correct: "b",
      },
      {
        question: "What is the square of 12?",
        options: { a: "124", b: "142", c: "144", d: "122" },
        correct: "c",
      },
    ],
    "English Language": [
      {
        question: "Which of these is a noun?",
        options: { a: "Run", b: "Happy", c: "Dog", d: "Quickly" },
        correct: "c",
      },
      {
        question: "Choose the correct spelling.",
        options: { a: "Receive", b: "Recieve", c: "Receeve", d: "Reccieve" },
        correct: "a",
      },
      {
        question: "What is the opposite of 'cold'?",
        options: { a: "Hot", b: "Warm", c: "Cool", d: "Freezing" },
        correct: "a",
      },
      {
        question: "Which sentence is grammatically correct?",
        options: {
          a: "She don't like apples.",
          b: "She doesn't likes apples.",
          c: "She doesn't like apples.",
          d: "She not like apples.",
        },
        correct: "c",
      },
      {
        question: "What is a synonym for 'happy'?",
        options: { a: "Sad", b: "Joyful", c: "Angry", d: "Tired" },
        correct: "b",
      },
    ],
    Literature: [
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: {
          a: "William Shakespeare",
          b: "Charles Dickens",
          c: "Mark Twain",
          d: "Jane Austen",
        },
        correct: "a",
      },
      {
        question: "What is the main theme of 'Animal Farm'?",
        options: {
          a: "Love",
          b: "Revolution",
          c: "Friendship",
          d: "Wealth",
        },
        correct: "b",
      },
      {
        question: "Who is the author of 'Pride and Prejudice'?",
        options: {
          a: "Emily Brontë",
          b: "Jane Austen",
          c: "Charlotte Brontë",
          d: "Virginia Woolf",
        },
        correct: "b",
      },
      {
        question: "Which novel features the character 'Jay Gatsby'?",
        options: {
          a: "Moby Dick",
          b: "The Great Gatsby",
          c: "1984",
          d: "To Kill a Mockingbird",
        },
        correct: "b",
      },
      {
        question: "Who wrote 'Things Fall Apart'?",
        options: {
          a: "Wole Soyinka",
          b: "Chinua Achebe",
          c: "Ngugi wa Thiong'o",
          d: "Toni Morrison",
        },
        correct: "b",
      },
    ],
  };

  const handleAnswerSelection = (option) => {
    setAnswers({
      ...answers,
      [`${activeTab}-${currentQuestionIndex}`]: option,
    });
  };

  const currentQuestions = questions[activeTab] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const optionLabels = ["A", "B", "C", "D"]; // Define option labels
  const submitExam = () => {
    setShowModal(true);
  };

  const confirmSubmit = () => {
    setShowModal(false);
    setShowResultModal(true); // Show result modal
  };
  return (
    <>
      <TopNav />
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3 time-submit-container">
          <h3 className="text-danger">
            Time Remaining: {formatTime(remainingTime)}
          </h3>
          <button className="btn btn-primary" onClick={submitExam}>
            Submit Exam
          </button>
        </div>
      </div>

      <div
        className="container "
        style={{ marginTop: "40px", marginBottom: "100px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="exam-container p-4">
            {/* Tab Navigation */}
            <ul className="nav nav-tabs">
              {subjects.map((subject, index) => (
                <li className="nav-item" key={index}>
                  <button
                    className={`nav-link ${
                      activeTab === subject ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(subject);
                      setCurrentQuestionIndex(0);
                    }}
                    style={{
                      backgroundColor:
                        activeTab === subject ? "#007bff" : "transparent",
                      color: activeTab === subject ? "white" : "black",
                      fontWeight: activeTab === subject ? "bold" : "normal",
                    }}
                  >
                    {subject}
                  </button>
                </li>
              ))}
            </ul>

            {/* Progress Tracker */}
            <div className=" my-3">
              <button className="btn btn-info">
                Question {currentQuestionIndex + 1} / {currentQuestions.length}
              </button>
            </div>

            {/* Display One Question */}
            <div className="question-box p-4 rounded shadow">
              <p className="fs-5 fw-bold">{currentQuestion?.question}</p>
              <div>
                {Object.entries(currentQuestion?.options || {}).map(
                  ([key, value], index) => (
                    <div key={key} className="option-box">
                      <span className="fw-bold me-2">
                        {optionLabels[index]}.
                      </span>
                      <input
                        type="radio"
                        id={`${activeTab}-${currentQuestionIndex}-${key}`}
                        name={`question-${currentQuestionIndex}`}
                        value={key}
                        checked={
                          answers[`${activeTab}-${currentQuestionIndex}`] ===
                          key
                        }
                        onChange={() => handleAnswerSelection(key)}
                        className="form-check-input custom-radio"
                      />
                      <label
                        htmlFor={`${activeTab}-${currentQuestionIndex}-${key}`}
                        className="ms-2"
                      >
                        {value}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Previous and Next Buttons - Now Closer */}
            <div className="d-flex  gap-2 mt-4">
              <button
                className="btn btn-secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
              >
                Previous
              </button>

              <button
                className="btn btn-secondary"
                disabled={currentQuestionIndex === currentQuestions.length - 1}
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
              >
                Next
              </button>
            </div>

            <div className=" my-3">
              <button className="btn btn-info">
                Attempted{" "}
                {
                  Object.keys(answers).filter((key) =>
                    key.startsWith(activeTab)
                  ).length
                }{" "}
                / {currentQuestions.length}
              </button>
            </div>

            {/* Pagination */}
            <div className=" mt-4">
              {currentQuestions.map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-lg btn-sm mx-1 ${
                    currentQuestionIndex === index
                      ? "btn-primary"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submission Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Are you sure you want to submit this exam?</h4>
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={confirmSubmit}>
                Yes, Submit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Exam Result Modal */}
      {showResultModal && (
        <ExamResultModal
          score={85}
          totalScore={100}
          breakdown={[
            {
              subject: "Math",
              visited: 10,
              attempted: 8,
              score: 7,
              aggregate: 90,
            },
            {
              subject: "Science",
              visited: 12,
              attempted: 10,
              score: 8,
              aggregate: 85,
            },
            {
              subject: "English",
              visited: 15,
              attempted: 12,
              score: 10,
              aggregate: 92,
            },
          ]}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </>
  );
};

export default Exam;
